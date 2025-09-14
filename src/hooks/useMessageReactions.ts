'use client'

import { useState, useCallback } from 'react'
import { Message, MessageReaction } from '@/types'

// CATEGORY: Data & State Hook
// CONTEXT: Client

export function useMessageReactions() {
  const [reactions, setReactions] = useState<Record<string, MessageReaction[]>>({})

  const addReaction = useCallback(async (messageId: string, emoji: string, userId: string) => {
    const reaction: MessageReaction = {
      messageId,
      userId,
      emoji,
      timestamp: new Date()
    }

    setReactions(prev => {
      const messageReactions = prev[messageId] || []
      const existingReaction = messageReactions.find(
        r => r.userId === userId && r.emoji === emoji
      )

      if (existingReaction) {
        // User already reacted with this emoji, remove it
        return {
          ...prev,
          [messageId]: messageReactions.filter(r => r !== existingReaction)
        }
      }

      // Add new reaction
      return {
        ...prev,
        [messageId]: [...messageReactions, reaction]
      }
    })

    // Send to server
    try {
      await fetch('http://localhost:3000/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, emoji, userId, action: 'add' })
      })
    } catch (error) {
      console.error('Failed to add reaction:', error)
    }
  }, [])

  const removeReaction = useCallback(async (messageId: string, emoji: string, userId: string) => {
    setReactions(prev => {
      const messageReactions = prev[messageId] || []
      return {
        ...prev,
        [messageId]: messageReactions.filter(
          r => !(r.userId === userId && r.emoji === emoji)
        )
      }
    })

    // Send to server
    try {
      await fetch('http://localhost:3000/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, emoji, userId, action: 'remove' })
      })
    } catch (error) {
      console.error('Failed to remove reaction:', error)
    }
  }, [])

  const getReactionsForMessage = useCallback((messageId: string) => {
    const messageReactions = reactions[messageId] || []
    
    // Group reactions by emoji
    const grouped = messageReactions.reduce((acc, reaction) => {
      if (!acc[reaction.emoji]) {
        acc[reaction.emoji] = []
      }
      acc[reaction.emoji].push(reaction.userId)
      return acc
    }, {} as Record<string, string[]>)

    return grouped
  }, [reactions])

  const getReactionCount = useCallback((messageId: string, emoji: string) => {
    const messageReactions = reactions[messageId] || []
    return messageReactions.filter(r => r.emoji === emoji).length
  }, [reactions])

  const hasUserReacted = useCallback((messageId: string, emoji: string, userId: string) => {
    const messageReactions = reactions[messageId] || []
    return messageReactions.some(r => r.userId === userId && r.emoji === emoji)
  }, [reactions])

  return {
    reactions,
    addReaction,
    removeReaction,
    getReactionsForMessage,
    getReactionCount,
    hasUserReacted
  }
}
