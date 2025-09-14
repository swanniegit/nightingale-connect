'use client'
import { TypingIndicator as TypingIndicatorType } from '@/types'
import { cn } from '@/lib/utils'

// CATEGORY: UI Utilities
// CONTEXT: Client

interface TypingIndicatorProps {
  typingUsers: TypingIndicatorType[]
  currentUserId: string
  className?: string
}

export function TypingIndicator({ 
  typingUsers, 
  currentUserId, 
  className 
}: TypingIndicatorProps) {
  if (typingUsers.length === 0) return null

  const otherUsers = typingUsers.filter(user => user.userId !== currentUserId)
  if (otherUsers.length === 0) return null

  return (
    <div className={cn('flex items-center gap-2 text-sm text-gray-500 px-4 py-2', className)}>
      <TypingDots />
      <span>{getTypingText(otherUsers)}</span>
    </div>
  )
}

function TypingDots() {
  return (
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
    </div>
  )
}

function getTypingText(otherUsers: TypingIndicatorType[]): string {
  if (otherUsers.length === 1) {
    return `${otherUsers[0].userId} is typing...`
  } else if (otherUsers.length === 2) {
    return `${otherUsers[0].userId} and ${otherUsers[1].userId} are typing...`
  } else {
    return `${otherUsers.length} people are typing...`
  }
}
