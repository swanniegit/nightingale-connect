'use client'

import { useState, useEffect } from 'react'
import { Message } from '@/types'
import { EnhancedMessageBubble } from './EnhancedMessageBubble'
import { Button } from './Button'
import { cn } from '@/lib/utils'

// CATEGORY: UI Utilities
// CONTEXT: Client

interface MessageHistoryProps {
  messages: Message[]
  currentUserId: string
  onMessageClick?: (message: Message) => void
  className?: string
}

export function MessageHistory({
  messages,
  currentUserId,
  onMessageClick,
  className
}: MessageHistoryProps) {
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const MESSAGES_PER_PAGE = 20

  // Load initial messages
  useEffect(() => {
    const initialMessages = messages.slice(0, MESSAGES_PER_PAGE)
    setDisplayedMessages(initialMessages)
    setHasMore(messages.length > MESSAGES_PER_PAGE)
  }, [messages])

  const loadMoreMessages = () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    
    // Simulate loading delay
    setTimeout(() => {
      const currentCount = displayedMessages.length
      const nextMessages = messages.slice(currentCount, currentCount + MESSAGES_PER_PAGE)
      
      setDisplayedMessages(prev => [...prev, ...nextMessages])
      setHasMore(currentCount + MESSAGES_PER_PAGE < messages.length)
      setIsLoading(false)
    }, 500)
  }

  const getSenderName = (senderId: string) => {
    if (senderId === currentUserId) return 'You'
    return `User ${senderId.slice(-4)}`
  }

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {}
    
    messages.forEach(message => {
      const date = new Date(message.createdAt).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })
    
    return groups
  }

  const messageGroups = groupMessagesByDate(displayedMessages)

  return (
    <div className={cn('space-y-4', className)}>
      {Object.entries(messageGroups).map(([date, dateMessages]) => (
        <div key={date}>
          {/* Date Header */}
          <div className="sticky top-0 bg-white py-2 border-b border-gray-200">
            <div className="text-center">
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>

          {/* Messages for this date */}
          <div className="space-y-2 py-2">
            {dateMessages.map((message) => (
              <div
                key={message.id || message.cid}
                onClick={() => onMessageClick?.(message)}
                className={onMessageClick ? 'cursor-pointer hover:bg-gray-50 p-2 rounded' : ''}
              >
                <EnhancedMessageBubble
                  message={message}
                  isOwn={message.senderId === currentUserId}
                  senderName={getSenderName(message.senderId)}
                  onReaction={() => {}}
                  onRemoveReaction={() => {}}
                  currentUserId={currentUserId}
                  onReply={() => {}}
                  showThreadIndicator={false}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center py-4">
          <Button
            onClick={loadMoreMessages}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                Loading more messages...
              </>
            ) : (
              'Load More Messages'
            )}
          </Button>
        </div>
      )}

      {!hasMore && displayedMessages.length > 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          No more messages to load
        </div>
      )}
    </div>
  )
}
