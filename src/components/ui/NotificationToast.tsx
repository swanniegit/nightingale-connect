'use client'

import { useState, useEffect } from 'react'
import { Button } from './Button'
import { cn } from '@/lib/utils'

// CATEGORY: UI Utilities
// CONTEXT: Client

interface NotificationToastProps {
  title: string
  message: string
  senderName?: string
  roomName?: string
  isMention?: boolean
  onClose: () => void
  onClick?: () => void
  className?: string
}

export function NotificationToast({
  title,
  message,
  senderName,
  roomName,
  isMention = false,
  onClose,
  onClick,
  className
}: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for animation to complete
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  const handleClick = () => {
    onClick?.()
    onClose()
  }

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 max-w-sm bg-white border rounded-lg shadow-lg',
        'transform transition-all duration-300 ease-in-out',
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
        className
      )}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-sm">{title}</h4>
              {isMention && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  Mention
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">{message}</p>
            {roomName && (
              <p className="text-xs text-gray-500">in {roomName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        {onClick && (
          <div className="mt-3 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClick}
              className="flex-1"
            >
              View Message
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              Dismiss
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
