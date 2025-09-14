import { NextRequest, NextResponse } from 'next/server'

// CATEGORY: API Route Handlers
// CONTEXT: Server
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params
    
    // Mock data for specific room
    const messages = [
      {
        id: '1',
        content: `Hello from ${roomId} room!`,
        roomId,
        userId: 'user1',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        content: 'How can I help you today?',
        roomId,
        userId: 'user2',
        timestamp: new Date().toISOString(),
      },
    ]

    return NextResponse.json(messages, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch room messages' },
      { status: 500 }
    )
  }
}
