'use client'
import { useState, useCallback } from 'react'
import { Message } from '@/types'
import { ReactionButton } from './ReactionButton'
import { EmojiPicker } from './EmojiPicker'
import { cn } from '@/lib/utils'

// CATEGORY: UI Utilities
// CONTEXT: Client

interface MessageReactionsProps {
  message: Message
  onReaction: (emoji: string) => void
  onRemoveReaction: (emoji: string) => void
  currentUserId: string
  className?: string
}

export function MessageReactions({ 
  message, 
  onReaction, 
  onRemoveReaction, 
  currentUserId,
  className
}: MessageReactionsProps) {
  const [showPicker, setShowPicker] = useState(false)

  const handleReactionClick = useCallback((emoji: string) => {
    const hasReacted = message.reactions?.[emoji]?.includes(currentUserId)
    if (hasReacted) {
      onRemoveReaction(emoji)
    } else {
      onReaction(emoji)
    }
  }, [message.reactions, currentUserId, onReaction, onRemoveReaction])

  const handleEmojiSelect = useCallback((emoji: string) => {
    onReaction(emoji)
    setShowPicker(false)
  }, [onReaction])

  if (!message.reactions || Object.keys(message.reactions).length === 0) {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        <EmojiPicker onEmojiSelect={handleEmojiSelect} />
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-1 flex-wrap', className)}>
      {Object.entries(message.reactions).map(([emoji, userIds]) => (
        <ReactionButton
          key={emoji}
          emoji={emoji}
          count={userIds.length}
          hasReacted={userIds.includes(currentUserId)}
          onClick={() => handleReactionClick(emoji)}
        />
      ))}
      <EmojiPicker onEmojiSelect={handleEmojiSelect} />
    </div>
  )
}
