import { createClient } from '@supabase/supabase-js'
import { config } from './config'

// CATEGORY: Core Libs/Types
// CONTEXT: Shared

const supabaseUrl = config.supabase.url || 'https://placeholder.supabase.co'
const serviceRoleKey = config.supabase.serviceRoleKey || 'placeholder-service-key'

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
