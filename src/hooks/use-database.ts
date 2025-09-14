import { useState, useEffect } from 'react'
import { dbp } from '@/lib/database'
import { runMigrations } from '@/lib/database-migrations'

// CATEGORY: Data & State Hook
// CONTEXT: Client
export function useDatabase() {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function initDatabase() {
      try {
        await dbp
        await runMigrations()
        setIsReady(true)
      } catch (err) {
        setError(err as Error)
      }
    }

    initDatabase()
  }, [])

  return { isReady, error }
}
