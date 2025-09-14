'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuthContext } from '@/components/providers/AuthProvider'
import { useTypingIndicator } from '@/hooks/useTypingIndicator'
import { useMessageReactions } from '@/hooks/useMessageReactions'
import { EnhancedMessageBubble } from '@/components/ui/EnhancedMessageBubble'
import { TypingIndicator } from '@/components/ui/TypingIndicator'
import { ChatInput } from '@/components/ui/ChatInput'
import { Card } from '@/components/ui/Card'
import { Message } from '@/types'

// CATEGORY: Client Orchestrator
// CONTEXT: Client

interface EnhancedChatRoomProps {
  roomId: string
  roomName: string
}

export function EnhancedChatRoom({ roomId, roomName }: EnhancedChatRoomProps) {
  const { user, demoLogin } = useAuthContext()
  const [messages, setMessages] = useState<Message[]>([])
  const [replyTo, setReplyTo] = useState<Message | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { typingUsers, handleTyping } = useTypingIndicator({
    roomId,
    currentUserId: user?.id || '',
  })

  const {
    addReaction,
    removeReaction,
    getReactionsForMessage
  } = useMessageReactions()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const url = `http://localhost:3000/api/messages/room/${roomId}`
        console.log('Fetching messages from:', url)
        const response = await fetch(url)
        
        console.log('Response status:', response.status)
        console.log('Response headers:', Object.fromEntries(response.headers.entries()))
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text()
          console.error('Expected JSON but got:', text.substring(0, 100))
          throw new Error('Response is not JSON')
        }
        
        const data = await response.json()
        
        const formattedMessages: Message[] = data.map((msg: any) => ({
          id: msg.id,
          cid: msg.id,
          roomId: msg.roomId,
          senderId: msg.userId || msg.senderId,
          createdAt: new Date(msg.timestamp),
          status: 'sent' as const,
          kind: msg.kind || 'text',
          text: msg.content,
          reactions: getReactionsForMessage(msg.id)
        }))
        
        setMessages(formattedMessages)
      } catch (error) {
        console.error('Failed to load messages:', error)
        // Set some mock messages for demo purposes
        setMessages([
          {
            id: 'demo-1',
            cid: 'demo-1',
            roomId,
            senderId: 'demo-user',
            createdAt: new Date(),
            status: 'sent',
            kind: 'text',
            text: `Welcome to ${roomName}! This is a demo message.`,
            reactions: {}
          }
        ])
      }
    }

    loadMessages()
  }, [roomId, roomName, getReactionsForMessage])

  const handleSendMessage = async (content: string) => {
    if (!user || !content.trim()) return

    const newMessage: Message = {
      id: crypto.randomUUID(),
      cid: crypto.randomUUID(),
      roomId,
      senderId: user.id,
      createdAt: new Date(),
      status: 'sending',
      kind: 'text',
      text: content,
      replyTo: replyTo?.id,
      reactions: {}
    }

    setMessages(prev => [...prev, newMessage])
    setReplyTo(null)

    try {
      const response = await fetch('http://localhost:3000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          content,
          replyTo: replyTo?.id
        })
      })

      if (response.ok) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, status: 'sent' }
              : msg
          )
        )
      } else {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, status: 'failed' }
              : msg
          )
        )
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'failed' }
            : msg
        )
      )
    }
  }

  const handleReaction = async (messageId: string, emoji: string) => {
    if (!user) return
    await addReaction(messageId, emoji, user.id)
  }

  const handleRemoveReaction = async (messageId: string, emoji: string) => {
    if (!user) return
    await removeReaction(messageId, emoji, user.id)
  }

  const handleReply = (message: Message) => {
    setReplyTo(message)
  }

  const getSenderName = (senderId: string) => {
    if (senderId === user?.id) return 'You'
    return `User ${senderId.slice(-4)}`
  }

  return (
    <Card className="h-96 flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold">{roomName}</h3>
        {replyTo && (
          <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
            <div className="font-medium">Replying to:</div>
            <div className="text-gray-600 truncate">
              {replyTo.text || 'Media message'}
            </div>
            <button
              onClick={() => setReplyTo(null)}
              className="text-blue-600 hover:text-blue-800 text-xs"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message) => (
          <EnhancedMessageBubble
            key={message.id || message.cid}
            message={{
              ...message,
              reactions: getReactionsForMessage(message.id || message.cid)
            }}
            isOwn={message.senderId === user?.id}
            senderName={getSenderName(message.senderId)}
            onReaction={handleReaction}
            onRemoveReaction={handleRemoveReaction}
            currentUserId={user?.id || ''}
            onReply={handleReply}
          />
        ))}
        
        <TypingIndicator
          typingUsers={typingUsers}
          currentUserId={user?.id || ''}
        />
        
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        {!user ? (
          <div className="text-center py-4">
            <p className="text-gray-500 mb-2">Please log in to send messages</p>
            <button
              onClick={demoLogin}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Demo Login
            </button>
          </div>
        ) : (
          <ChatInput
            onSendMessage={handleSendMessage}
            onTyping={handleTyping}
            placeholder={`Message ${roomName}...`}
            disabled={false}
          />
        )}
      </div>
    </Card>
  )
}
