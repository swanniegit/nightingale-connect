import { createClient } from '@supabase/supabase-js'
import { MessageDB, RoomDB, MemberDB } from './database-operations'
import { type Message, type Room, type Member } from '@/types'

// CATEGORY: Core Libs
// CONTEXT: Client
export class RealtimeManager {
  private supabase: any
  private subscriptions: Map<string, any> = new Map()
  private isConnected = false

  constructor(supabaseUrl: string, supabaseAnonKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseAnonKey)
  }

  async connect(): Promise<void> {
    try {
      // Test connection
      const { data, error } = await this.supabase
        .from('messages')
        .select('count')
        .limit(1)

      if (error) throw error

      this.isConnected = true
      console.log('✅ Realtime connection established')
    } catch (error) {
      console.error('❌ Realtime connection failed:', error)
      throw error
    }
  }

  subscribeToMessages(roomId: string, onMessage: (message: Message) => void): void {
    const subscription = this.supabase
      .channel(`messages:${roomId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `room_id=eq.${roomId}`
        }, 
        async (payload: any) => {
          try {
            const message = payload.new as Message
            await MessageDB.add(message)
            onMessage(message)
            console.log('📨 New message received:', message)
          } catch (error) {
            console.error('❌ Failed to process new message:', error)
          }
        }
      )
      .subscribe()

    this.subscriptions.set(`messages:${roomId}`, subscription)
  }

  subscribeToRooms(onRoom: (room: Room) => void): void {
    const subscription = this.supabase
      .channel('rooms')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'rooms'
        }, 
        async (payload: any) => {
          try {
            const room = payload.new as Room
            await RoomDB.add(room)
            onRoom(room)
            console.log('🏠 New room received:', room)
          } catch (error) {
            console.error('❌ Failed to process new room:', error)
          }
        }
      )
      .subscribe()

    this.subscriptions.set('rooms', subscription)
  }

  subscribeToMembers(roomId: string, onMember: (member: Member) => void): void {
    const subscription = this.supabase
      .channel(`members:${roomId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'members',
          filter: `room_id=eq.${roomId}`
        }, 
        async (payload: any) => {
          try {
            const member = payload.new as Member
            await MemberDB.add(member)
            onMember(member)
            console.log('👥 New member received:', member)
          } catch (error) {
            console.error('❌ Failed to process new member:', error)
          }
        }
      )
      .subscribe()

    this.subscriptions.set(`members:${roomId}`, subscription)
  }

  unsubscribe(channel: string): void {
    const subscription = this.subscriptions.get(channel)
    if (subscription) {
      this.supabase.removeChannel(subscription)
      this.subscriptions.delete(channel)
      console.log(`🔌 Unsubscribed from ${channel}`)
    }
  }

  unsubscribeAll(): void {
    this.subscriptions.forEach((_, channel) => {
      this.unsubscribe(channel)
    })
    console.log('🔌 All subscriptions removed')
  }

  getConnectionStatus(): boolean {
    return this.isConnected
  }

  getActiveSubscriptions(): string[] {
    return Array.from(this.subscriptions.keys())
  }
}

// Singleton instance
let realtimeManager: RealtimeManager | null = null

export function getRealtimeManager(): RealtimeManager {
  if (!realtimeManager) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('⚠️ Supabase configuration missing - using placeholder values')
      // Use placeholder values for development
      realtimeManager = new RealtimeManager(
        'https://placeholder.supabase.co',
        'placeholder-key'
      )
    } else {
      realtimeManager = new RealtimeManager(supabaseUrl, supabaseAnonKey)
    }
  }
  
  return realtimeManager
}
