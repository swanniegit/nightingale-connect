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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get('roomId')

    if (!roomId) {
      return NextResponse.json(
        { error: 'Room ID is required' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Mock thread data for now
    const threads = [
      {
        id: 'thread-1',
        parentMessageId: 'msg-1',
        roomId,
        title: 'Discussion about patient care',
        createdAt: new Date().toISOString(),
        lastMessageAt: new Date().toISOString(),
        participantCount: 3
      }
    ]

    return NextResponse.json(threads, { headers: corsHeaders })
  } catch (error) {
    console.error('Error fetching threads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch threads' },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { parentMessageId, roomId, title } = body

    if (!parentMessageId || !roomId) {
      return NextResponse.json(
        { error: 'Parent message ID and room ID are required' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Mock thread creation
    const newThread = {
      id: `thread-${Date.now()}`,
      parentMessageId,
      roomId,
      title: title || 'New Thread',
      createdAt: new Date().toISOString(),
      lastMessageAt: new Date().toISOString(),
      participantCount: 1
    }

    return NextResponse.json(newThread, { headers: corsHeaders })
  } catch (error) {
    console.error('Error creating thread:', error)
    return NextResponse.json(
      { error: 'Failed to create thread' },
      { status: 500, headers: corsHeaders }
    )
  }
}
