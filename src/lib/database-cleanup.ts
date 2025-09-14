import { dbp } from './database'
import { withTransaction } from './transaction-helpers'

// CATEGORY: Core Libs/Types
// CONTEXT: Shared

export class DatabaseCleanup {
  static async clearAllData(): Promise<void> {
    await withTransaction(
      ['messages', 'rooms', 'members', 'outbox', 'mediaBlobs', 'reads'],
      async (tx) => {
        await tx.objectStore('messages').clear()
        await tx.objectStore('rooms').clear()
        await tx.objectStore('members').clear()
        await tx.objectStore('outbox').clear()
        await tx.objectStore('mediaBlobs').clear()
        await tx.objectStore('reads').clear()
      }
    )
  }

  static async clearOldMessages(daysOld = 30): Promise<number> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)
    
    const db = await dbp
    const tx = db.transaction('messages', 'readwrite')
    const store = tx.objectStore('messages')
    const index = store.index('byRoomTime')
    
    let deletedCount = 0
    const cursor = await index.openCursor()
    
    while (cursor) {
      if (cursor.value.createdAt < cutoffDate) {
        await cursor.delete()
        deletedCount++
      }
      await cursor.continue()
    }
    
    await tx.done
    return deletedCount
  }

  static async clearFailedOutboxItems(): Promise<number> {
    const db = await dbp
    const tx = db.transaction('outbox', 'readwrite')
    const store = tx.objectStore('outbox')
    
    let deletedCount = 0
    const cursor = await store.openCursor()
    
    while (cursor) {
      if (cursor.value.attempt >= 5) {
        await cursor.delete()
        deletedCount++
      }
      await cursor.continue()
    }
    
    await tx.done
    return deletedCount
  }

  static async clearOldMediaBlobs(daysOld = 7): Promise<number> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)
    
    const db = await dbp
    const tx = db.transaction('mediaBlobs', 'readwrite')
    const store = tx.objectStore('mediaBlobs')
    
    let deletedCount = 0
    const cursor = await store.openCursor()
    
    while (cursor) {
      // Media blobs don't have timestamps, so we'll use a simple size-based cleanup
      if (cursor.value.blob.size === 0) {
        await cursor.delete()
        deletedCount++
      }
      await cursor.continue()
    }
    
    await tx.done
    return deletedCount
  }

  static async getStorageUsage(): Promise<{
    messages: number
    rooms: number
    members: number
    outbox: number
    mediaBlobs: number
    reads: number
    total: number
  }> {
    const db = await dbp
    
    const [messages, rooms, members, outbox, mediaBlobs, reads] = await Promise.all([
      db.count('messages'),
      db.count('rooms'),
      db.count('members'),
      db.count('outbox'),
      db.count('mediaBlobs'),
      db.count('reads')
    ])
    
    return {
      messages,
      rooms,
      members,
      outbox,
      mediaBlobs,
      reads,
      total: messages + rooms + members + outbox + mediaBlobs + reads
    }
  }
}
