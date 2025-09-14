'use client'
import { useCallback } from 'react'
import { ReactionButton } from './ReactionButton'
import { cn } from '@/lib/utils'

// CATEGORY: UI Utilities
// CONTEXT: Client

interface QuickReactionsProps {
  reactions: Record<string, string[]>
  currentUserId: string
  onReaction: (emoji: string) => void
  className?: string
}

export function QuickReactions({ 
  reactions, 
  currentUserId, 
  onReaction, 
  className 
}: QuickReactionsProps) {
  const handleReaction = useCallback((emoji: string) => {
    onReaction(emoji)
  }, [onReaction])

  const reactionEntries = Object.entries(reactions)
  if (reactionEntries.length === 0) return null

  return (
    <div className={cn('flex flex-wrap gap-1 mt-2', className)}>
      {reactionEntries.map(([emoji, userIds]) => (
        <ReactionButton
          key={emoji}
          emoji={emoji}
          count={userIds.length}
          hasReacted={userIds.includes(currentUserId)}
          onClick={() => handleReaction(emoji)}
        />
      ))}
    </div>
  )
}
