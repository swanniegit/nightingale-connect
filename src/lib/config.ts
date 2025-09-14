// CATEGORY: Core Libs/Types
// CONTEXT: Shared

export const config = {
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    name: 'Nightingale Connect',
    version: '1.0.0',
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
}

// Validate required environment variables
if (typeof window !== 'undefined' && !config.supabase.url) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (typeof window !== 'undefined' && !config.supabase.anonKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}
