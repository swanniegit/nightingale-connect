import { createClient } from '@supabase/supabase-js'
import { config } from './config'

// CATEGORY: Core Libs/Types
// CONTEXT: Shared

// Use fallback values for development
const supabaseUrl = config.supabase.url || 'https://placeholder.supabase.co'
const supabaseAnonKey = config.supabase.anonKey || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})
