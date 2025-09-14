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
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Mock notification settings - in a real app, this would query a database
    const settings = {
      pushEnabled: true,
      emailEnabled: false,
      soundEnabled: true,
      mentionOnly: false,
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
      }
    }

    return NextResponse.json(settings, { headers: corsHeaders })
  } catch (error) {
    console.error('Error fetching notification settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notification settings' },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, settings } = body

    if (!userId || !settings) {
      return NextResponse.json(
        { error: 'User ID and settings are required' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Mock settings update - in a real app, this would save to a database
    console.log('Updating notification settings for user:', userId, settings)

    return NextResponse.json(
      { success: true, settings },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('Error updating notification settings:', error)
    return NextResponse.json(
      { error: 'Failed to update notification settings' },
      { status: 500, headers: corsHeaders }
    )
  }
}
