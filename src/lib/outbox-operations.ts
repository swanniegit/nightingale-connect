import { dbp } from './database'
import { OutboxItem } from '@/types'

// CATEGORY: Core Libs/Types
// CONTEXT: Shared

export class OutboxDB {
  static async add(item: Omit<OutboxItem, 'attempt' | 'nextAttemptAt'>): Promise<void> {
    const db = await dbp
    if (!db) throw new Error('Database not available')
    const outboxItem = {
      ...item,
      attempt: 0,
      nextAttemptAt: new Date()
    }
    await db.add('outbox', outboxItem)
  }

  static async getAll(): Promise<OutboxItem[]> {
    const db = await dbp
    if (!db) throw new Error('Database not available')
    return await db.getAll('outbox')
  }

  static async getPending(): Promise<OutboxItem[]> {
    const db = await dbp
    if (!db) throw new Error('Database not available')
    const all = await db.getAll('outbox')
    const now = new Date()
    return all.filter(item => item.nextAttemptAt <= now)
  }

  static async updateAttempt(cid: string, attempt: number, nextAttemptAt: Date): Promise<void> {
    const db = await dbp
    if (!db) throw new Error('Database not available')
    const item = await db.get('outbox', cid)
    if (item) {
      item.attempt = attempt
      item.nextAttemptAt = nextAttemptAt
      await db.put('outbox', item)
    }
  }

  static async remove(cid: string): Promise<void> {
    const db = await dbp
    if (!db) throw new Error('Database not available')
    await db.delete('outbox', cid)
  }
}
