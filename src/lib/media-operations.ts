import { dbp } from './database'
import { MediaBlob } from '@/types'

// CATEGORY: Core Libs/Types
// CONTEXT: Shared

export class MediaDB {
  static async store(blobRef: string, blob: Blob): Promise<void> {
    const db = await dbp
    if (!db) throw new Error('Database not available')
    const mediaBlob: MediaBlob = { blobRef, blob }
    await db.add('mediaBlobs', mediaBlob)
  }

  static async get(blobRef: string): Promise<Blob | null> {
    const db = await dbp
    if (!db) throw new Error('Database not available')
    const mediaBlob = await db.get('mediaBlobs', blobRef)
    return mediaBlob?.blob || null
  }

  static async remove(blobRef: string): Promise<void> {
    const db = await dbp
    if (!db) throw new Error('Database not available')
    await db.delete('mediaBlobs', blobRef)
  }

  static async getAll(): Promise<MediaBlob[]> {
    const db = await dbp
    if (!db) throw new Error('Database not available')
    return await db.getAll('mediaBlobs')
  }

  static async clear(): Promise<void> {
    const db = await dbp
    if (!db) throw new Error('Database not available')
    const tx = db.transaction('mediaBlobs', 'readwrite')
    const store = tx.objectStore('mediaBlobs')
    await store.clear()
  }
}
