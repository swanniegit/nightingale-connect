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
    const { email, password } = await request.json()

    // Basic validation
    if (!email || !password) {
    return NextResponse.json(
      { message: 'Email and password are required' },
      { status: 400, headers: corsHeaders }
    )
    }

    // Mock authentication logic
    // In a real app, this would validate against a database
    if (email === 'test@example.com' && password === 'password') {
      return NextResponse.json({
        user: {
          id: 'user-1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'practitioner',
          avatar: null,
        },
        token: 'mock-jwt-token'
      }, { headers: corsHeaders })
    }

    // User's test account
    if (email === 'christo.mailme@gmail.com' && password === 'Sw@n3poel') {
      return NextResponse.json({
        user: {
          id: 'christo-1',
          email: 'christo.mailme@gmail.com',
          name: 'Christo',
          role: 'practitioner',
          avatar: null,
        },
        token: 'mock-christo-token'
      }, { headers: corsHeaders })
    }

    // Check for demo accounts
    if (email === 'admin@nightingale.com' && password === 'admin123') {
      return NextResponse.json({
        user: {
          id: 'admin-1',
          email: 'admin@nightingale.com',
          name: 'Admin User',
          role: 'admin',
          avatar: null,
        },
        token: 'mock-admin-token'
      })
    }

    if (email === 'nurse@nightingale.com' && password === 'nurse123') {
      return NextResponse.json({
        user: {
          id: 'nurse-1',
          email: 'nurse@nightingale.com',
          name: 'Nurse User',
          role: 'nurse',
          avatar: null,
        },
        token: 'mock-nurse-token'
      })
    }

    return NextResponse.json(
      { message: 'Invalid credentials' },
      { status: 401, headers: corsHeaders }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}