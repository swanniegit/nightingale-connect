'use client'
import { useState, useEffect, useCallback } from 'react'
import { TypingIndicator } from '@/types'

// CATEGORY: Data & State Hook
// CONTEXT: Client

interface UseTypingUsersProps {
  roomId: string
}

interface UseTypingUsersReturn {
  typingUsers: TypingIndicator[]
  addTypingUser: (indicator: TypingIndicator) => void
  removeTypingUser: (userId: string) => void
  clearTypingUsers: () => void
}

export function useTypingUsers({ roomId }: UseTypingUsersProps): UseTypingUsersReturn {
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([])

  const addTypingUser = useCallback((indicator: TypingIndicator) => {
    setTypingUsers(prev => {
      const filtered = prev.filter(u => u.userId !== indicator.userId)
      return [...filtered, indicator]
    })
  }, [])

  const removeTypingUser = useCallback((userId: string) => {
    setTypingUsers(prev => prev.filter(u => u.userId !== userId))
  }, [])

  const clearTypingUsers = useCallback(() => {
    setTypingUsers([])
  }, [])

  // Auto-remove typing users after 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setTypingUsers(prev => 
        prev.filter(u => now.getTime() - u.timestamp.getTime() < 5000)
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return { typingUsers, addTypingUser, removeTypingUser, clearTypingUsers }
}
