'use client'

import { cn } from '@/lib/utils'

// CATEGORY: UI Utilities
// CONTEXT: Client

interface ThreadIndicatorProps {
  replyCount: number
  lastReplyAt?: Date
  onClick: () => void
  className?: string
}

export function ThreadIndicator({
  replyCount,
  lastReplyAt,
  onClick,
  className
}: ThreadIndicatorProps) {
  if (replyCount === 0) return null

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800',
        'bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded',
        className
      )}
    >
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
      <span>{replyCount} {replyCount === 1 ? 'reply' : 'replies'}</span>
      {lastReplyAt && (
        <span className="text-gray-500">
          • {lastReplyAt.toLocaleTimeString()}
        </span>
      )}
    </button>
  )
}
