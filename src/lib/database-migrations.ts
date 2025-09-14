import { dbp } from './database'

// CATEGORY: Core Libs/Types
// CONTEXT: Shared

export interface Migration {
  version: number
  name: string
  up: (db: IDBDatabase) => Promise<void>
  down: (db: IDBDatabase) => Promise<void>
}

const migrations: Migration[] = [
  {
    version: 1,
    name: 'Initial schema',
    up: async (db) => {
      // Messages store
      const messages = db.createObjectStore('messages', { keyPath: 'id' })
      messages.createIndex('byRoomTime', ['roomId', 'createdAt'])
      messages.createIndex('byStatus', 'status')
      messages.createIndex('byCid', 'cid')
      
      // Rooms store
      const rooms = db.createObjectStore('rooms', { keyPath: 'id' })
      rooms.createIndex('byLastMessage', 'lastMessageAt')
      
      // Members store
      const members = db.createObjectStore('members', { keyPath: ['roomId', 'userId'] })
      members.createIndex('byRoom', 'roomId')
      
      // Outbox store
      db.createObjectStore('outbox', { keyPath: 'cid' })
      
      // Media blobs store
      db.createObjectStore('mediaBlobs', { keyPath: 'blobRef' })
      
      // Reads store
      const reads = db.createObjectStore('reads', { keyPath: ['roomId', 'userId', 'messageId'] })
      reads.createIndex('byRoomUser', ['roomId', 'userId'])
      
      // Keys store (for future E2EE)
      const keys = db.createObjectStore('keys', { keyPath: ['roomId', 'deviceId'] })
      keys.createIndex('byRoom', 'roomId')
    },
    down: async (db) => {
      db.deleteObjectStore('messages')
      db.deleteObjectStore('rooms')
      db.deleteObjectStore('members')
      db.deleteObjectStore('outbox')
      db.deleteObjectStore('mediaBlobs')
      db.deleteObjectStore('reads')
      db.deleteObjectStore('keys')
    }
  }
]

export async function runMigrations(): Promise<void> {
  const db = await dbp
  if (!db) throw new Error('Database not available')
  const currentVersion = db.version
  
  for (const migration of migrations) {
    if (migration.version > currentVersion) {
      console.log(`Running migration: ${migration.name}`)
      await migration.up(db as any)
    }
  }
}
