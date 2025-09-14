import { dbp } from './database'
import { ReadReceipt } from '@/types'

// CATEGORY: Core Libs/Types
// CONTEXT: Shared

export class ReadDB {
  static async markRead(roomId: string, userId: string, messageId: string): Promise<void> {
    const db = await dbp
    if (!db) throw new Error('Database not available')
    const readReceipt: ReadReceipt = {
      roomId,
      userId,
      messageId,
      readAt: new Date()
    }
    await db.put('reads', readReceipt)
  }

  static async getByRoom(roomId: string): Promise<ReadReceipt[]> {
    const db = await dbp
    if (!db) throw new Error('Database not available')
    const tx = db.transaction('reads', 'readonly')
    const store = tx.objectStore('reads')
    const index = store.index('byRoomUser')
    
    return await index.getAll([roomId, ''])
  }

  static async getByUser(userId: string): Promise<ReadReceipt[]> {
    const db = await dbp
    if (!db) throw new Error('Database not available')
    const all = await db.getAll('reads')
    return all.filter(read => read.userId === userId)
  }

  static async getByMessage(messageId: string): Promise<ReadReceipt[]> {
    const db = await dbp
    if (!db) throw new Error('Database not available')
    const all = await db.getAll('reads')
    return all.filter(read => read.messageId === messageId)
  }

  static async remove(roomId: string, userId: string, messageId: string): Promise<void> {
    const db = await dbp
    if (!db) throw new Error('Database not available')
    await db.delete('reads', `${roomId}-${userId}-${messageId}`)
  }
}
