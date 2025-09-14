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

export async function GET(request: NextRequest) {
  try {
    // Mock data for now
    const messages = [
      {
        id: '1',
        content: 'Hello! How are you?',
        roomId: 'general',
        userId: 'user1',
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
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Mock message creation
    const newMessage = {
      id: Date.now().toString(),
      ...body,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(newMessage, { 
      status: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    )
  }
}
