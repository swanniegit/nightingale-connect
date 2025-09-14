import { NextRequest, NextResponse } from 'next/server'

// CATEGORY: API Route Handler
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
    const { email, password, name, role } = await request.json()

    // Basic validation
    if (!email || !password || !name || !role) {
    return NextResponse.json(
      { message: 'All fields are required' },
      { status: 400, headers: corsHeaders }
    )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
    return NextResponse.json(
      { message: 'Invalid email format' },
      { status: 400, headers: corsHeaders }
    )
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Validate role
    const validRoles = ['admin', 'practitioner', 'nurse']
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { message: 'Invalid role' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Mock user creation
    // In a real app, this would create a user in the database
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      name,
      role,
      avatar: null,
    }

    return NextResponse.json({
      user: newUser,
      token: `mock-token-${Date.now()}`
    }, { status: 201, headers: corsHeaders })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}
