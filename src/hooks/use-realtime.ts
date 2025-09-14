import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Message } from '@/types'

// CATEGORY: Data & State Hook
// CONTEXT: Client
export function useRealtime(roomId: string, onMessage: (message: Message) => void) {
  const channelRef = useRef<any>(null)

  useEffect(() => {
    if (!roomId) return

    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const message = payload.new as Message
          onMessage(message)
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      channel.unsubscribe()
    }
  }, [roomId, onMessage])
}
