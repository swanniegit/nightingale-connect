import { dbp } from './database'
import { Member } from '@/types'

// CATEGORY: Core Libs/Types
// CONTEXT: Shared

export class MemberDB {
  static async add(member: Omit<Member, 'joinedAt'>): Promise<void> {
    const db = await dbp
    if (!db) throw new Error('Database not available')
    const newMember = { ...member, joinedAt: new Date() }
    await db.add('members', newMember)
  }

  static async getByRoom(roomId: string): Promise<Member[]> {
    const db = await dbp
    if (!db) throw new Error('Database not available')
    const tx = db.transaction('members', 'readonly')
    const store = tx.objectStore('members')
    const index = store.index('byRoom')
    
    return await index.getAll(roomId)
  }

  static async getByUser(userId: string): Promise<Member[]> {
    const db = await dbp
    if (!db) throw new Error('Database not available')
    const tx = db.transaction('members', 'readonly')
    const store = tx.objectStore('members')
    
    const members = await store.getAll()
    return members.filter(m => m.userId === userId)
  }

  static async remove(roomId: string, userId: string): Promise<void> {
    const db = await dbp
    if (!db) throw new Error('Database not available')
    await db.delete('members', `${roomId}-${userId}`)
  }

  static async updateRole(roomId: string, userId: string, role: Member['role']): Promise<void> {
    const db = await dbp
    if (!db) throw new Error('Database not available')
    const member = await db.get('members', `${roomId}-${userId}`)
    if (member) {
      member.role = role
      await db.put('members', member)
    }
  }
}
