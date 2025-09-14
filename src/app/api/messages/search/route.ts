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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, roomId, messageType, dateFrom, dateTo, senderId } = body

    if (!query || !query.trim()) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Mock search results - in a real app, this would query a database
    const allMessages = [
      {
        id: 'msg-1',
        cid: 'msg-1',
        roomId: roomId || 'general',
        senderId: 'user-1',
        createdAt: new Date().toISOString(),
        status: 'sent',
        kind: 'text',
        text: 'Hello everyone! How is the patient doing today?',
        reactions: {}
      },
      {
        id: 'msg-2',
        cid: 'msg-2',
        roomId: roomId || 'general',
        senderId: 'user-2',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        status: 'sent',
        kind: 'text',
        text: 'The patient is stable and responding well to treatment.',
        reactions: {}
      },
      {
        id: 'msg-3',
        cid: 'msg-3',
        roomId: roomId || 'general',
        senderId: 'user-1',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        status: 'sent',
        kind: 'medical',
        text: 'Vital signs: BP 120/80, HR 72, Temp 98.6°F',
        medicalData: {
          type: 'vital',
          data: { bp: '120/80', hr: 72, temp: 98.6 },
          priority: 'normal'
        },
        reactions: {}
      },
      {
        id: 'msg-4',
        cid: 'msg-4',
        roomId: roomId || 'general',
        senderId: 'user-3',
        createdAt: new Date(Date.now() - 10800000).toISOString(),
        status: 'sent',
        kind: 'text',
        text: 'Please update the medication schedule for tomorrow.',
        reactions: {}
      },
      {
        id: 'msg-5',
        cid: 'msg-5',
        roomId: roomId || 'general',
        senderId: 'user-2',
        createdAt: new Date(Date.now() - 14400000).toISOString(),
        status: 'sent',
        kind: 'image',
        text: 'X-ray results attached',
        media: {
          url: '/api/media/xray-001.jpg',
          mime: 'image/jpeg',
          w: 800,
          h: 600
        },
        reactions: {}
      }
    ]

    // Filter messages based on search criteria
    let filteredMessages = allMessages.filter(msg => {
      // Room filter
      if (roomId && msg.roomId !== roomId) return false
      
      // Sender filter
      if (senderId && msg.senderId !== senderId) return false
      
      // Message type filter
      if (messageType && msg.kind !== messageType) return false
      
      // Date range filter
      if (dateFrom) {
        const msgDate = new Date(msg.createdAt)
        if (msgDate < new Date(dateFrom)) return false
      }
      if (dateTo) {
        const msgDate = new Date(msg.createdAt)
        if (msgDate > new Date(dateTo)) return false
      }
      
      // Text search
      const searchText = query.toLowerCase()
      const msgText = (msg.text || '').toLowerCase()
      
      return msgText.includes(searchText)
    })

    // Sort by relevance (exact matches first, then by date)
    filteredMessages.sort((a, b) => {
      const aText = (a.text || '').toLowerCase()
      const bText = (b.text || '').toLowerCase()
      const searchText = query.toLowerCase()
      
      const aExact = aText === searchText
      const bExact = bText === searchText
      
      if (aExact && !bExact) return -1
      if (!aExact && bExact) return 1
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return NextResponse.json(filteredMessages, { headers: corsHeaders })
  } catch (error) {
    console.error('Error searching messages:', error)
    return NextResponse.json(
      { error: 'Failed to search messages' },
      { status: 500, headers: corsHeaders }
    )
  }
}
