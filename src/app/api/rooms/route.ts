import { NextRequest, NextResponse } from 'next/server'

// CATEGORY: API Route Handlers
// CONTEXT: Server
export async function GET(request: NextRequest) {
  try {
    // Mock data for now
    const rooms = [
      {
        id: 'general',
        name: 'General',
        description: 'General discussion room',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'emergency',
        name: 'Emergency',
        description: 'Emergency communications',
        createdAt: new Date().toISOString(),
      },
    ]

    return NextResponse.json(rooms)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Mock room creation
    const newRoom = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(newRoom, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create room' },
      { status: 500 }
    )
  }
}
