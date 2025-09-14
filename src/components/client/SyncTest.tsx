'use client'

import { useState, useEffect } from 'react'
import { useSync } from '@/hooks/useSync'
import { SyncStatus } from '@/components/ui/SyncStatus'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

// CATEGORY: Client Orchestrator
// CONTEXT: Client
export function SyncTest() {
  const { isOnline, isSyncing, lastSync, error, syncNow, retrySync } = useSync()
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Data Synchronization Test</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <SyncStatus
            isOnline={isOnline}
            isSyncing={isSyncing}
            lastSync={lastSync}
            error={error}
            onRetry={retrySync}
          />
          
          <div className="flex gap-2">
            <Button
              onClick={syncNow}
              disabled={!isHydrated || isSyncing || !isOnline}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
            >
              {!isHydrated ? 'Loading...' : (isSyncing ? 'Syncing...' : 'Sync Now')}
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Sync Details:</h4>
          <div className="text-sm space-y-1">
            <div>Status: {!isHydrated ? '⏳ Loading...' : (isOnline ? '🟢 Online' : '🔴 Offline')}</div>
            <div>Syncing: {!isHydrated ? '⏳ Loading...' : (isSyncing ? '🔄 Yes' : '⏸️ No')}</div>
            <div>Last Sync: {!isHydrated ? '⏳ Loading...' : (lastSync ? lastSync.toLocaleString() : 'Never')}</div>
            {isHydrated && error && <div className="text-red-600">Error: {error}</div>}
          </div>
        </div>

        <div className="text-xs text-gray-500">
          <p>This component demonstrates real-time data synchronization between:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>IndexedDB (local storage)</li>
            <li>API endpoints (server data)</li>
            <li>Supabase (real-time updates)</li>
          </ul>
        </div>
      </div>
    </Card>
  )
}
