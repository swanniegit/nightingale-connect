'use client'

import { Message } from '@/types'
import { EnhancedMessageBubble } from './EnhancedMessageBubble'
import { cn } from '@/lib/utils'

// CATEGORY: UI Utilities
// CONTEXT: Client

interface MessageSearchResultsProps {
  messages: Message[]
  query: string
  onMessageClick: (message: Message) => void
  currentUserId: string
  className?: string
}

export function MessageSearchResults({
  messages,
  query,
  onMessageClick,
  currentUserId,
  className
}: MessageSearchResultsProps) {
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text
    
    const regex = new RegExp(`(${query})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    )
  }

  const getSenderName = (senderId: string) => {
    if (senderId === currentUserId) return 'You'
    return `User ${senderId.slice(-4)}`
  }

  if (messages.length === 0) {
    return (
      <div className={cn('text-center py-8 text-gray-500', className)}>
        <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <p>No messages found for &ldquo;{query}&rdquo;</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="text-sm text-gray-600 mb-4">
        Found {messages.length} message{messages.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
      </div>
      
      {messages.map((message) => (
        <div
          key={message.id || message.cid}
          onClick={() => onMessageClick(message)}
          className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">
              {getSenderName(message.senderId)}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(message.createdAt).toLocaleString()}
            </span>
          </div>
          
          <div className="text-sm text-gray-700">
            {message.text ? highlightText(message.text, query) : (
              <span className="italic text-gray-500">
                {message.kind === 'image' ? '📷 Image' : 
                 message.kind === 'file' ? '📎 File' : 
                 message.kind === 'medical' ? '🏥 Medical Data' : 
                 'Media message'}
              </span>
            )}
          </div>
          
          {message.replyTo && (
            <div className="mt-2 text-xs text-blue-600">
              ↳ Replying to a message
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
