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
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params

    // Mock thread data for now
    const threads = [
      {
        id: `thread-1-${roomId}`,
        parentMessageId: `msg-1-${roomId}`,
        roomId,
        title: 'Discussion about patient care',
        createdAt: new Date().toISOString(),
        lastMessageAt: new Date().toISOString(),
        participantCount: 3
      },
      {
        id: `thread-2-${roomId}`,
        parentMessageId: `msg-2-${roomId}`,
        roomId,
        title: 'Treatment plan discussion',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        lastMessageAt: new Date(Date.now() - 1800000).toISOString(),
        participantCount: 2
      }
    ]

    return NextResponse.json(threads, { headers: corsHeaders })
  } catch (error) {
    console.error('Error fetching room threads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch room threads' },
      { status: 500, headers: corsHeaders }
    )
  }
}
