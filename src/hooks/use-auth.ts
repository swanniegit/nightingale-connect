import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

// CATEGORY: Data & State Hook
// CONTEXT: Client
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return { user, isLoading, isAuthenticated: !!user }
}
