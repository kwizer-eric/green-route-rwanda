import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

export function isSupabaseConfigured() {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project') &&
    !supabaseUrl.includes('placeholder') &&
    supabaseAnonKey !== 'your-anon-key' &&
    supabaseAnonKey !== 'placeholder-key',
  )
}

export function getSupabaseConfigError() {
  if (isSupabaseConfigured()) return null
  return 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment (Vercel → Settings → Environment Variables), then redeploy.'
}

if (!isSupabaseConfigured()) {
  console.error('[Supabase]', getSupabaseConfigError())
}

export const supabase = createClient(
  supabaseUrl || 'http://127.0.0.1:1',
  supabaseAnonKey || 'missing-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
)
