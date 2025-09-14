'use client'

import { useState, useEffect } from 'react'

// CATEGORY: UI Utilities
// CONTEXT: Client
interface SyncStatusProps {
  isOnline: boolean
  isSyncing: boolean
  lastSync: Date | null
  error: string | null
  onRetry: () => void
}

export function SyncStatus({ 
  isOnline, 
  isSyncing, 
  lastSync, 
  error, 
  onRetry 
}: SyncStatusProps) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])
  const getStatusColor = () => {
    // During hydration, always show neutral state to prevent mismatch
    if (!isHydrated) return 'text-gray-500'
    if (error) return 'text-red-500'
    if (isSyncing) return 'text-blue-500'
    if (isOnline) return 'text-green-500'
    return 'text-gray-500'
  }

  const getStatusText = () => {
    // During hydration, always show neutral state to prevent mismatch
    if (!isHydrated) return 'Loading...'
    if (error) return 'Sync Error'
    if (isSyncing) return 'Syncing...'
    if (isOnline) return 'Online'
    return 'Offline'
  }

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Never'
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date)
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={`w-2 h-2 rounded-full ${getStatusColor().replace('text-', 'bg-')}`} />
      <span className={getStatusColor()}>{getStatusText()}</span>
      {lastSync && (
        <span className="text-gray-500">
          Last sync: {formatLastSync(lastSync)}
        </span>
      )}
      {error && (
        <button
          onClick={onRetry}
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Retry
        </button>
      )}
    </div>
  )
}
