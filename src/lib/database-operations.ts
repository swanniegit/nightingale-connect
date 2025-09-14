import { dbp } from './database'
import { Message, Room, Member, OutboxItem, MediaBlob, ReadReceipt } from '@/types'

// CATEGORY: Core Libs/Types
// CONTEXT: Shared

// Helper function to ensure IndexedDB is available
function ensureClientSide() {
  if (!dbp) {
    throw new Error('IndexedDB not available on server side')
  }
}

export class MessageDB {
  static async create(message: Omit<Message, 'id'>): Promise<string> {
    ensureClientSide()
    const db = await dbp!
    const id = crypto.randomUUID()
    const newMessage = { ...message, id }
    await db.add('messages', newMessage)
    return id
  }

  static async getByRoom(roomId: string, limit = 50): Promise<Message[]> {
    ensureClientSide()
    const db = await dbp!
    const tx = db.transaction('messages', 'readonly')
    const store = tx.objectStore('messages')
    const index = store.index('byRoomTime')
    
    const messages = await index.getAll([roomId, new Date(0)], limit)
    return messages.reverse()
  }

  static async updateStatus(cid: string, status: Message['status']): Promise<void> {
    ensureClientSide()
    const db = await dbp!
    const tx = db.transaction('messages', 'readwrite')
    const store = tx.objectStore('messages')
    const index = store.index('byCid')
    
    const message = await index.get(cid)
    if (message) {
      message.status = status
      await store.put(message)
    }
  }

  static async getByCid(cid: string): Promise<Message | null> {
    ensureClientSide()
    const db = await dbp!
    const tx = db.transaction('messages', 'readonly')
    const store = tx.objectStore('messages')
    const index = store.index('byCid')
    
    return await index.get(cid) || null
  }

  static async delete(id: string): Promise<void> {
    ensureClientSide()
    const db = await dbp!
    await db.delete('messages', id)
  }

  static async add(message: Message): Promise<void> {
    ensureClientSide()
    const db = await dbp!
    await db.add('messages', message)
  }
}

export class RoomDB {
  static async create(room: Omit<Room, 'id'>): Promise<string> {
    ensureClientSide()
    const db = await dbp!
    const id = crypto.randomUUID()
    const newRoom = { ...room, id }
    await db.add('rooms', newRoom)
    return id
  }

  static async getAll(): Promise<Room[]> {
    ensureClientSide()
    const db = await dbp!
    return await db.getAll('rooms')
  }

  static async getById(id: string): Promise<Room | null> {
    ensureClientSide()
    const db = await dbp!
    return await db.get('rooms', id) || null
  }

  static async add(room: Room): Promise<void> {
    ensureClientSide()
    const db = await dbp!
    await db.add('rooms', room)
  }

  static async delete(id: string): Promise<void> {
    ensureClientSide()
    const db = await dbp!
    await db.delete('rooms', id)
  }
}

export class MemberDB {
  static async create(member: Omit<Member, 'id'>): Promise<string> {
    ensureClientSide()
    const db = await dbp!
    const id = crypto.randomUUID()
    const newMember = { ...member, id }
    await db.add('members', newMember)
    return id
  }

  static async getByRoom(roomId: string): Promise<Member[]> {
    ensureClientSide()
    const db = await dbp!
    const tx = db.transaction('members', 'readonly')
    const store = tx.objectStore('members')
    const index = store.index('byRoom')
    
    return await index.getAll(roomId)
  }

  static async getByUser(userId: string): Promise<Member[]> {
    ensureClientSide()
    const db = await dbp!
    const tx = db.transaction('members', 'readonly')
    const store = tx.objectStore('members')
    const index = store.index('byRoom')
    
    return await index.getAll(userId)
  }

  static async add(member: Member): Promise<void> {
    ensureClientSide()
    const db = await dbp!
    await db.add('members', member)
  }

  static async delete(id: string): Promise<void> {
    ensureClientSide()
    const db = await dbp!
    await db.delete('members', id)
  }
}