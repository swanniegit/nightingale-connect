'use client'

import { useState, useEffect } from 'react'
import { Message } from '@/types'
import { EnhancedMessageBubble } from './EnhancedMessageBubble'
import { ChatInput } from './ChatInput'
import { Button } from './Button'
import { Card } from './Card'
import { cn } from '@/lib/utils'

// CATEGORY: UI Utilities
// CONTEXT: Client

interface ThreadViewProps {
  threadId: string
  parentMessage: Message
  messages: Message[]
  currentUserId: string
  onSendReply: (content: string, replyTo: string) => void
  onClose: () => void
  className?: string
}

export function ThreadView({
  threadId,
  parentMessage,
  messages,
  currentUserId,
  onSendReply,
  onClose,
  className
}: ThreadViewProps) {
  const [replyContent, setReplyContent] = useState('')

  const handleSendReply = (content: string) => {
    onSendReply(content, parentMessage.id || parentMessage.cid)
    setReplyContent('')
  }

  const getSenderName = (senderId: string) => {
    if (senderId === currentUserId) return 'You'
    return `User ${senderId.slice(-4)}`
  }

  return (
    <div className={cn('fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50', className)}>
      <Card className="w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Thread</h3>
            <p className="text-sm text-gray-600">
              {messages.length} {messages.length === 1 ? 'reply' : 'replies'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </Button>
        </div>

        {/* Parent Message */}
        <div className="p-4 border-b bg-gray-50">
          <div className="text-xs text-gray-500 mb-2">
            Original message
          </div>
          <EnhancedMessageBubble
            message={parentMessage}
            isOwn={parentMessage.senderId === currentUserId}
            senderName={getSenderName(parentMessage.senderId)}
            onReaction={() => {}}
            onRemoveReaction={() => {}}
            currentUserId={currentUserId}
            onReply={() => {}}
            showThreadIndicator={false}
          />
        </div>

        {/* Thread Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((message) => (
            <EnhancedMessageBubble
              key={message.id || message.cid}
              message={message}
              isOwn={message.senderId === currentUserId}
              senderName={getSenderName(message.senderId)}
              onReaction={() => {}}
              onRemoveReaction={() => {}}
              currentUserId={currentUserId}
              onReply={() => {}}
              showThreadIndicator={false}
            />
          ))}
        </div>

        {/* Reply Input */}
        <div className="p-4 border-t">
          <ChatInput
            onSendMessage={handleSendReply}
            onTyping={() => {}}
            placeholder="Reply to thread..."
            disabled={false}
          />
        </div>
      </Card>
    </div>
  )
}
