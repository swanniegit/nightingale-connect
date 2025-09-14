import { MessageDB, RoomDB } from './database-operations'
import { MessagesAPI } from './api/messages'
import { RoomsAPI } from './api/rooms'
import { getRealtimeManager } from './realtime'

// CATEGORY: Core Libs/Types
// CONTEXT: Shared
interface SyncStatus {
  isOnline: boolean
  lastSync: Date | null
  pendingChanges: number
  isSyncing: boolean
  error: string | null
}

type SyncEvent = 'start' | 'success' | 'error' | 'offline' | 'online'

class SyncManager {
  private status: SyncStatus = {
    isOnline: navigator.onLine,
    lastSync: null,
    pendingChanges: 0,
    isSyncing: false,
    error: null,
  }

  private listeners = new Map<string, (status: SyncStatus) => void>()
  private abortController: AbortController | null = null

  constructor() {
    // Only set up event listeners on client side
    if (typeof window !== 'undefined') {
      this.setupEventListeners()
    }
  }

  private setupEventListeners() {
    // Modern event handling with proper cleanup
    const handleOnline = () => this.handleOnline()
    const handleOffline = () => this.handleOffline()
    
    window.addEventListener('online', handleOnline, { passive: true })
    window.addEventListener('offline', handleOffline, { passive: true })
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      this.abortController?.abort()
    })
  }

  private handleOnline() {
    this.updateStatus({ isOnline: true, error: null })
    this.syncAll()
  }

  private handleOffline() {
    this.updateStatus({ isOnline: false })
  }

  async syncAll() {
    if (!this.status.isOnline || this.status.isSyncing) return

    // Cancel previous sync if running
    this.abortController?.abort()
    this.abortController = new AbortController()

    this.updateStatus({ isSyncing: true, error: null })

    try {
      // Use Promise.allSettled for parallel sync operations
      const results = await Promise.allSettled([
        this.syncMessages(),
        this.syncRooms(),
      ])

      // Check for any failures
      const failures = results.filter(result => result.status === 'rejected')
      if (failures.length > 0) {
        throw new Error(`Sync failed: ${failures.length} operations failed`)
      }

      this.updateStatus({
        lastSync: new Date(),
        pendingChanges: 0,
        isSyncing: false,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown sync error'
      this.updateStatus({
        isSyncing: false,
        error: errorMessage,
      })
    }
  }

  private async syncMessages() {
    try {
      const response = await MessagesAPI.getByRoom('general')
      if (response.data) {
        // Use Promise.allSettled to handle individual failures gracefully
        const results = await Promise.allSettled(
          response.data.map(message => this.safeAddMessage(message))
        )
        
        const failures = results.filter(result => result.status === 'rejected')
        if (failures.length > 0) {
          console.warn(`Sync messages: ${failures.length} messages already exist or failed to sync`)
        }
      }
    } catch (error) {
      console.warn('Sync messages failed (likely server-side):', error)
    }
  }

  private async syncRooms() {
    try {
      const response = await RoomsAPI.getAll()
      if (response.data) {
        // Use Promise.allSettled to handle individual failures gracefully
        const results = await Promise.allSettled(
          response.data.map(room => this.safeAddRoom(room))
        )
        
        const failures = results.filter(result => result.status === 'rejected')
        if (failures.length > 0) {
          console.warn(`Sync rooms: ${failures.length} rooms already exist or failed to sync`)
        }
      }
    } catch (error) {
      console.warn('Sync rooms failed (likely server-side):', error)
    }
  }

  private async safeAddMessage(message: any) {
    try {
      await MessageDB.add(message)
    } catch (error) {
      if (error instanceof Error && error.name === 'ConstraintError') {
        // Message already exists, this is expected
        return
      }
      throw error
    }
  }

  private async safeAddRoom(room: any) {
    try {
      await RoomDB.add(room)
    } catch (error) {
      if (error instanceof Error && error.name === 'ConstraintError') {
        // Room already exists, this is expected
        return
      }
      throw error
    }
  }

  subscribe(id: string, listener: (status: SyncStatus) => void) {
    this.listeners.set(id, listener)
    return () => this.listeners.delete(id)
  }

  private updateStatus(updates: Partial<SyncStatus>) {
    this.status = { ...this.status, ...updates }
    this.notifyListeners()
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.status))
  }

  getStatus() {
    return { ...this.status }
  }

  // Modern cleanup method
  destroy() {
    this.abortController?.abort()
    this.listeners.clear()
  }
}

export const syncManager = new SyncManager()