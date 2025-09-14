'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { TypingIndicator } from '@/types'
import { apiClient } from '@/lib/api-client'

// CATEGORY: Data & State Hook
// CONTEXT: Client

interface UseTypingIndicatorProps {
  roomId: string
  currentUserId: string
}

interface UseTypingIndicatorReturn {
  typingUsers: TypingIndicator[]
  isTyping: boolean
  handleTyping: () => void
  startTyping: () => void
  stopTyping: () => void
}

export function useTypingIndicator({
  roomId,
  currentUserId
}: UseTypingIndicatorProps): UseTypingIndicatorReturn {
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const startTyping = useCallback(async () => {
    if (isTyping) return
    setIsTyping(true)
    
    try {
      await apiClient.post('/typing', { userId: currentUserId, roomId, isTyping: true })
    } catch (error) {
      console.error('Failed to send typing start:', error)
    }
  }, [isTyping, currentUserId, roomId])

  const stopTyping = useCallback(async () => {
    if (!isTyping) return
    setIsTyping(false)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    
    try {
      await apiClient.post('/typing', { userId: currentUserId, roomId, isTyping: false })
    } catch (error) {
      console.error('Failed to send typing stop:', error)
    }
  }, [isTyping, currentUserId, roomId])

  const handleTyping = useCallback(() => {
    startTyping()
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(stopTyping, 3000)
  }, [startTyping, stopTyping])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (isTyping) stopTyping()
    }
  }, [isTyping, stopTyping])

  return { typingUsers, isTyping, handleTyping, startTyping, stopTyping }
}
