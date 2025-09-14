'use client'
import { cn } from '@/lib/utils'

// CATEGORY: UI Utilities
// CONTEXT: Client

interface ReactionButtonProps {
  emoji: string
  count: number
  hasReacted: boolean
  onClick: () => void
  className?: string
}

export function ReactionButton({ 
  emoji, 
  count, 
  hasReacted, 
  onClick, 
  className 
}: ReactionButtonProps) {
  if (count === 0) return null

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-colors',
        hasReacted 
          ? 'bg-blue-100 text-blue-700 border border-blue-200' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        className
      )}
      aria-label={`${emoji} reaction (${count})`}
    >
      <span>{emoji}</span>
      <span className="font-medium">{count}</span>
    </button>
  )
}
