'use client'

import { useState } from 'react'
import { Message } from '@/types'
import { cn } from '@/lib/utils'

// CATEGORY: UI Utilities
// CONTEXT: Client

interface MessageThreadProps {
  threadId: string
  parentMessage: Message
  replies: Message[]
  onReply: (message: Message) => void
  onViewThread: (threadId: string) => void
  className?: string
}

export function MessageThread({
  threadId,
  parentMessage,
  replies,
  onReply,
  onViewThread,
  className
}: MessageThreadProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleReply = () => {
    onReply(parentMessage)
  }

  const handleViewThread = () => {
    onViewThread(threadId)
  }

  return (
    <div className={cn('border-l-2 border-blue-200 pl-3 ml-4', className)}>
      {/* Parent Message Preview */}
      <div className="bg-gray-50 rounded-lg p-2 mb-2">
        <div className="text-xs text-gray-500 mb-1">
          {parentMessage.senderId} • {parentMessage.createdAt.toLocaleTimeString()}
        </div>
        <div className="text-sm text-gray-700 truncate">
          {parentMessage.text || 'Media message'}
        </div>
      </div>

      {/* Thread Actions */}
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={handleReply}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          Reply
        </button>
        <button
          onClick={handleViewThread}
          className="text-xs text-gray-600 hover:text-gray-800"
        >
          View Thread ({replies.length})
        </button>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {/* Replies */}
      {isExpanded && (
        <div className="space-y-2">
          {replies.map((reply) => (
            <div key={reply.id} className="bg-white rounded p-2 border">
              <div className="text-xs text-gray-500 mb-1">
                {reply.senderId} • {reply.createdAt.toLocaleTimeString()}
              </div>
              <div className="text-sm">{reply.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
