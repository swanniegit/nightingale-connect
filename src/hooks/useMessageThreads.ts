'use client'

import { useState, useEffect, useCallback } from 'react'
import { Message, MessageThread } from '@/types'
import { apiClient } from '@/lib/api-client'

// CATEGORY: Data & State Hook
// CONTEXT: Client

interface UseMessageThreadsProps {
  roomId: string
  currentUserId: string
}

export function useMessageThreads({ roomId, currentUserId }: UseMessageThreadsProps) {
  const [threads, setThreads] = useState<Map<string, MessageThread>>(new Map())
  const [threadMessages, setThreadMessages] = useState<Map<string, Message[]>>(new Map())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load threads for a room
  const loadThreads = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await apiClient.get(`/threads/room/${roomId}`)
      
      if (response.error) {
        throw new Error(response.error)
      }

      const threadsData = response.data as MessageThread[]
      const threadsMap = new Map()
      
      threadsData.forEach(thread => {
        threadsMap.set(thread.id, thread)
      })
      
      setThreads(threadsMap)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load threads')
    } finally {
      setIsLoading(false)
    }
  }, [roomId])

  // Load messages for a specific thread
  const loadThreadMessages = useCallback(async (threadId: string) => {
    try {
      setError(null)
      
      const response = await apiClient.get(`/threads/${threadId}/messages`)
      
      if (response.error) {
        throw new Error(response.error)
      }

      const messages = response.data as Message[]
      setThreadMessages(prev => new Map(prev.set(threadId, messages)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load thread messages')
    }
  }, [])

  // Create a new thread
  const createThread = useCallback(async (parentMessageId: string, title?: string) => {
    try {
      setError(null)
      
      const response = await apiClient.post('/threads', {
        parentMessageId,
        roomId,
        title
      })
      
      if (response.error) {
        throw new Error(response.error)
      }

      const newThread = response.data as MessageThread
      setThreads(prev => new Map(prev.set(newThread.id, newThread)))
      
      return newThread
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create thread')
      throw err
    }
  }, [roomId])

  // Add a reply to a thread
  const addReply = useCallback(async (threadId: string, content: string) => {
    try {
      setError(null)
      
      const response = await apiClient.post(`/threads/${threadId}/messages`, {
        content,
        senderId: currentUserId,
        roomId
      })
      
      if (response.error) {
        throw new Error(response.error)
      }

      const newMessage = response.data as Message
      
      // Update thread messages
      setThreadMessages(prev => {
        const currentMessages = prev.get(threadId) || []
        return new Map(prev.set(threadId, [...currentMessages, newMessage]))
      })
      
      // Update thread last message time
      setThreads(prev => {
        const thread = prev.get(threadId)
        if (thread) {
          const currentMessages = threadMessages.get(threadId) || []
          const updatedThread = {
            ...thread,
            lastMessageAt: newMessage.createdAt,
            participantCount: new Set([...currentMessages, newMessage].map(m => m.senderId)).size
          }
          return new Map(prev.set(threadId, updatedThread))
        }
        return prev
      })
      
      return newMessage
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add reply')
      throw err
    }
  }, [currentUserId, roomId, threadMessages])

  // Get thread by parent message ID
  const getThreadByParentMessage = useCallback((parentMessageId: string) => {
    const threadsArray = Array.from(threads.values())
    for (const thread of threadsArray) {
      if (thread.parentMessageId === parentMessageId) {
        return thread
      }
    }
    return null
  }, [threads])

  // Get messages for a thread
  const getThreadMessages = useCallback((threadId: string) => {
    return threadMessages.get(threadId) || []
  }, [threadMessages])

  // Get reply count for a message
  const getReplyCount = useCallback((messageId: string) => {
    const thread = getThreadByParentMessage(messageId)
    if (!thread) return 0
    
    const messages = getThreadMessages(thread.id)
    return messages.length
  }, [getThreadByParentMessage, getThreadMessages])

  // Load threads on mount
  useEffect(() => {
    loadThreads()
  }, [loadThreads])

  return {
    threads: Array.from(threads.values()),
    threadMessages,
    isLoading,
    error,
    loadThreads,
    loadThreadMessages,
    createThread,
    addReply,
    getThreadByParentMessage,
    getThreadMessages,
    getReplyCount
  }
}
