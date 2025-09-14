import { dbp } from './database'
import { Room, Member } from '@/types'

// CATEGORY: Core Libs/Types
// CONTEXT: Shared

export class RoomDB {
  static async create(room: Omit<Room, 'id' | 'createdAt'>): Promise<string> {
    const db = await dbp
    if (!db) throw new Error('Database not available')
    const id = crypto.randomUUID()
    const newRoom = { ...room, id, createdAt: new Date() }
    await db.add('rooms', newRoom)
    return id
  }

  static async getAll(): Promise<Room[]> {
    const db = await dbp
    if (!db) throw new Error('Database not available')
    const tx = db.transaction('rooms', 'readonly')
    const store = tx.objectStore('rooms')
    const index = store.index('byLastMessage')
    
    return await index.getAll()
  }

  static async getById(id: string): Promise<Room | null> {
    const db = await dbp
    if (!db) throw new Error('Database not available')
    return await db.get('rooms', id) || null
  }

  static async updateLastMessage(roomId: string, lastMessageAt: Date): Promise<void> {
    const db = await dbp
    if (!db) throw new Error('Database not available')
    const room = await db.get('rooms', roomId)
    if (room) {
      room.lastMessageAt = lastMessageAt
      await db.put('rooms', room)
    }
  }

  static async delete(id: string): Promise<void> {
    const db = await dbp
    if (!db) throw new Error('Database not available')
    await db.delete('rooms', id)
  }
}
