import { openDB, DBSchema, IDBPDatabase } from 'idb'
import { Message, Room, Member } from '@/types'

// CATEGORY: Core Libs/Types
// CONTEXT: Shared

interface ChatDB extends DBSchema {
  messages: {
    key: string
    value: Message
    indexes: {
      'byRoomTime': [string, Date]
      'byStatus': string
      'byCid': string
    }
  }
  rooms: {
    key: string
    value: Room
    indexes: {
      'byLastMessage': Date
    }
  }
  members: {
    key: string
    value: Member
    indexes: {
      'byRoom': string
    }
  }
  outbox: {
    key: string
    value: {
      cid: string
      roomId: string
      payload: any
      attempt: number
      nextAttemptAt: Date
    }
  }
  mediaBlobs: {
    key: string
    value: {
      blobRef: string
      blob: Blob
    }
  }
  reads: {
    key: string
    value: {
      roomId: string
      userId: string
      messageId: string
      readAt: Date
    }
    indexes: {
      'byRoomUser': [string, string]
    }
  }
  keys: {
    key: string
    value: {
      roomId: string
      deviceId: string
      keyMaterial: string
    }
    indexes: {
      'byRoom': string
    }
  }
}

// Only initialize IndexedDB on client side
export const dbp = typeof window !== 'undefined' 
  ? openDB<ChatDB>('chatdb@v1', 1, {
      upgrade(db) {
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
    })
  : null
