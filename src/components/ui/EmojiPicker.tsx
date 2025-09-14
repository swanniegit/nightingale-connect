'use client'
import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

// CATEGORY: UI Utilities
// CONTEXT: Client

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  className?: string
}

const COMMON_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '👏']

export function EmojiPicker({ onEmojiSelect, className }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleEmojiClick = useCallback((emoji: string) => {
    onEmojiSelect(emoji)
    setIsOpen(false)
  }, [onEmojiSelect])

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Add reaction"
      >
        😊
      </button>
      
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 bg-white border rounded-lg shadow-lg p-2 z-10">
          <div className="grid grid-cols-4 gap-1">
            {COMMON_EMOJIS.map(emoji => (
              <button
                key={emoji}
                onClick={() => handleEmojiClick(emoji)}
                className="p-2 hover:bg-gray-100 rounded text-lg"
                aria-label={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
