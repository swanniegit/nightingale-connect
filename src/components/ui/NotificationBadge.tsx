'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

// CATEGORY: UI Utilities
// CONTEXT: Client

interface NotificationBadgeProps {
  count: number
  className?: string
  maxCount?: number
}

export function NotificationBadge({
  count,
  className,
  maxCount = 99
}: NotificationBadgeProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (count > 0) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [count])

  if (!isVisible || count === 0) return null

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString()

  return (
    <div
      className={cn(
        'absolute -top-1 -right-1 bg-red-500 text-white text-xs',
        'rounded-full min-w-[18px] h-[18px] flex items-center justify-center',
        'px-1 font-medium animate-pulse',
        className
      )}
    >
      {displayCount}
    </div>
  )
}
