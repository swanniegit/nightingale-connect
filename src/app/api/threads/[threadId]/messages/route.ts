import { NextRequest, NextResponse } from 'next/server'

// CATEGORY: API Route Handlers
// CONTEXT: Server

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const { threadId } = await params

    // Mock thread messages
    const messages = [
      {
        id: `reply-1-${threadId}`,
        cid: `reply-1-${threadId}`,
        roomId: 'general',
        senderId: 'user-1',
        createdAt: new Date().toISOString(),
        status: 'sent',
        kind: 'text',
        text: 'This is a reply in the thread',
        threadId,
        replyTo: 'msg-1'
      },
      {
        id: `reply-2-${threadId}`,
        cid: `reply-2-${threadId}`,
        roomId: 'general',
        senderId: 'user-2',
        createdAt: new Date(Date.now() - 60000).toISOString(),
        status: 'sent',
        kind: 'text',
        text: 'Another reply to continue the discussion',
        threadId,
        replyTo: 'msg-1'
      }
    ]

    return NextResponse.json(messages, { headers: corsHeaders })
  } catch (error) {
    console.error('Error fetching thread messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch thread messages' },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const { threadId } = await params
    const body = await request.json()
    const { content, senderId, roomId } = body

    if (!content || !senderId || !roomId) {
      return NextResponse.json(
        { error: 'Content, sender ID, and room ID are required' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Mock thread message creation
    const newMessage = {
      id: `reply-${Date.now()}-${threadId}`,
      cid: `reply-${Date.now()}-${threadId}`,
      roomId,
      senderId,
      createdAt: new Date().toISOString(),
      status: 'sent',
      kind: 'text',
      text: content,
      threadId,
      replyTo: 'msg-1' // This would be the parent message ID
    }

    return NextResponse.json(newMessage, { headers: corsHeaders })
  } catch (error) {
    console.error('Error creating thread message:', error)
    return NextResponse.json(
      { error: 'Failed to create thread message' },
      { status: 500, headers: corsHeaders }
    )
  }
}
