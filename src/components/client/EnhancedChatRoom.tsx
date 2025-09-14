'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuthContext } from '@/components/providers/AuthProvider'
import { useTypingIndicator } from '@/hooks/useTypingIndicator'
import { useMessageReactions } from '@/hooks/useMessageReactions'
import { useMessageThreads } from '@/hooks/useMessageThreads'
import { EnhancedMessageBubble } from '@/components/ui/EnhancedMessageBubble'
import { TypingIndicator } from '@/components/ui/TypingIndicator'
import { ThreadView } from '@/components/ui/ThreadView'
import { ChatInput } from '@/components/ui/ChatInput'
import { Card } from '@/components/ui/Card'
import { Message } from '@/types'
import { apiClient } from '@/lib/api-client'

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
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
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

  const {
    threads,
    getThreadByParentMessage,
    getThreadMessages,
    getReplyCount,
    createThread,
    addReply,
    loadThreadMessages
  } = useMessageThreads({
    roomId,
    currentUserId: user?.id || ''
  })

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await apiClient.get(`/messages/room/${roomId}`)
        
        if (response.error) {
          throw new Error(response.error)
        }
        
        const data = response.data as any[]
        
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
      const response = await apiClient.post('/messages', {
        roomId,
        content,
        replyTo: replyTo?.id
      })

      if (response.error) {
        throw new Error(response.error)
      }

      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'sent' }
            : msg
        )
      )
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

  const handleViewThread = async (messageId: string) => {
    try {
      // Check if thread exists
      let thread = getThreadByParentMessage(messageId)
      
      if (!thread) {
        // Create new thread
        thread = await createThread(messageId)
      }
      
      if (thread) {
        setSelectedThreadId(thread.id)
        await loadThreadMessages(thread.id)
      }
    } catch (error) {
      console.error('Failed to view thread:', error)
    }
  }

  const handleSendThreadReply = async (content: string, replyToMessageId: string) => {
    if (!selectedThreadId || !user) return

    try {
      await addReply(selectedThreadId, content)
    } catch (error) {
      console.error('Failed to send thread reply:', error)
    }
  }

  const handleCloseThread = () => {
    setSelectedThreadId(null)
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
        {messages.map((message) => {
          const messageId = message.id || message.cid
          const replyCount = getReplyCount(messageId)
          const thread = getThreadByParentMessage(messageId)
          const lastReplyAt = thread ? new Date(thread.lastMessageAt) : undefined

          return (
            <EnhancedMessageBubble
              key={messageId}
              message={{
                ...message,
                reactions: getReactionsForMessage(messageId)
              }}
              isOwn={message.senderId === user?.id}
              senderName={getSenderName(message.senderId)}
              onReaction={handleReaction}
              onRemoveReaction={handleRemoveReaction}
              currentUserId={user?.id || ''}
              onReply={handleReply}
              onViewThread={handleViewThread}
              replyCount={replyCount}
              lastReplyAt={lastReplyAt}
            />
          )
        })}
        
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

      {/* Thread View Modal */}
      {selectedThreadId && (
        <ThreadView
          threadId={selectedThreadId}
          parentMessage={messages.find(m => getThreadByParentMessage(m.id || m.cid)?.id === selectedThreadId) || messages[0]}
          messages={getThreadMessages(selectedThreadId)}
          currentUserId={user?.id || ''}
          onSendReply={handleSendThreadReply}
          onClose={handleCloseThread}
        />
      )}
    </Card>
  )
}
