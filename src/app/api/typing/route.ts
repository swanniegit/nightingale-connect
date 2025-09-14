import { NextRequest, NextResponse } from 'next/server'

// CATEGORY: API Route Handlers
// CONTEXT: Server

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { userId, roomId, isTyping } = await request.json()

    if (!userId || !roomId || typeof isTyping !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400, headers: corsHeaders }
      )
    }

    // In a real app, this would broadcast to WebSocket clients
    console.log(`User ${userId} ${isTyping ? 'started' : 'stopped'} typing in room ${roomId}`)

    return NextResponse.json(
      { success: true, timestamp: new Date().toISOString() },
      { status: 200, headers: corsHeaders }
    )
  } catch (error) {
    console.error('Typing indicator error:', error)
    return NextResponse.json(
      { error: 'Failed to process typing indicator' },
      { status: 500, headers: corsHeaders }
    )
  }
}
