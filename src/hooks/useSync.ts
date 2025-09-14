import { useState, useEffect, useCallback, useId } from 'react'
import { syncManager } from '@/lib/sync-manager'

// CATEGORY: Data & State Hook
// CONTEXT: Client
interface SyncStatus {
  isOnline: boolean
  lastSync: Date | null
  pendingChanges: number
  isSyncing: boolean
  error: string | null
}

export function useSync() {
  const [status, setStatus] = useState<SyncStatus>(syncManager.getStatus())
  const id = useId()

  useEffect(() => {
    const unsubscribe = syncManager.subscribe(id, setStatus)
    return unsubscribe
  }, [id])

  const syncNow = useCallback(() => {
    syncManager.syncAll()
  }, [])

  const retrySync = useCallback(() => {
    if (status.error) {
      syncManager.syncAll()
    }
  }, [status.error])

  return {
    ...status,
    syncNow,
    retrySync,
  }
}
