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
    const { messageId, emoji, userId, action } = await request.json()

    if (!messageId || !emoji || !userId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400, headers: corsHeaders }
      )
    }

    if (!['add', 'remove'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "add" or "remove"' },
        { status: 400, headers: corsHeaders }
      )
    }

    // In a real app, this would update the database
    console.log(`Reaction ${action}:`, { messageId, emoji, userId })

    return NextResponse.json(
      { 
        success: true, 
        messageId, 
        emoji, 
        userId, 
        action,
        timestamp: new Date().toISOString()
      },
      { status: 200, headers: corsHeaders }
    )
  } catch (error) {
    console.error('Reaction API error:', error)
    return NextResponse.json(
      { error: 'Failed to process reaction' },
      { status: 500, headers: corsHeaders }
    )
  }
}
