'use client'
import { cn } from '@/lib/utils'

// CATEGORY: UI Utilities
// CONTEXT: Client

interface TypingStatusProps {
  isTyping: boolean
  className?: string
}

export function TypingStatus({ isTyping, className }: TypingStatusProps) {
  if (!isTyping) return null

  return (
    <div className={cn('flex items-center gap-1 text-xs text-blue-500', className)}>
      <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
      <span>You are typing...</span>
    </div>
  )
}
