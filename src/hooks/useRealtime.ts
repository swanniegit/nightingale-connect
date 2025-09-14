import { useEffect, useState, useCallback } from 'react'
import { getRealtimeManager } from '@/lib/realtime'
import { type Message, type Room, type Member } from '@/types'

// CATEGORY: Data & State Hook
// CONTEXT: Client
export function useRealtime() {
  const [isConnected, setIsConnected] = useState(false)
  const [activeSubscriptions, setActiveSubscriptions] = useState<string[]>([])
  const [realtimeManager, setRealtimeManager] = useState<any>(null)

  useEffect(() => {
    const initRealtime = async () => {
      try {
        const manager = getRealtimeManager()
        await manager.connect()
        setRealtimeManager(manager)
        setIsConnected(true)
      } catch (error) {
        console.error('Failed to initialize realtime:', error)
        setIsConnected(false)
      }
    }

    initRealtime()

    return () => {
      if (realtimeManager) {
        realtimeManager.unsubscribeAll()
      }
    }
  }, [realtimeManager]) // Include realtimeManager in dependencies

  const subscribeToMessages = useCallback((roomId: string, onMessage: (message: Message) => void) => {
    if (!realtimeManager) return

    realtimeManager.subscribeToMessages(roomId, onMessage)
    setActiveSubscriptions(prev => [...prev, `messages:${roomId}`])
  }, [realtimeManager])

  const subscribeToRooms = useCallback((onRoom: (room: Room) => void) => {
    if (!realtimeManager) return

    realtimeManager.subscribeToRooms(onRoom)
    setActiveSubscriptions(prev => [...prev, 'rooms'])
  }, [realtimeManager])

  const subscribeToMembers = useCallback((roomId: string, onMember: (member: Member) => void) => {
    if (!realtimeManager) return

    realtimeManager.subscribeToMembers(roomId, onMember)
    setActiveSubscriptions(prev => [...prev, `members:${roomId}`])
  }, [realtimeManager])

  const unsubscribe = useCallback((channel: string) => {
    if (!realtimeManager) return

    realtimeManager.unsubscribe(channel)
    setActiveSubscriptions(prev => prev.filter(sub => sub !== channel))
  }, [realtimeManager])

  const unsubscribeAll = useCallback(() => {
    if (!realtimeManager) return

    realtimeManager.unsubscribeAll()
    setActiveSubscriptions([])
  }, [realtimeManager])

  return {
    isConnected,
    activeSubscriptions,
    subscribeToMessages,
    subscribeToRooms,
    subscribeToMembers,
    unsubscribe,
    unsubscribeAll
  }
}
