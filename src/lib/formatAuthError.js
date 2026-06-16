export function formatAuthError(err) {
  if (!err) return 'Something went wrong. Please try again.'

  const msg = err.message || String(err)
  const lower = msg.toLowerCase()

  if (
    lower.includes('failed to fetch') ||
    lower.includes('networkerror') ||
    err.name === 'AuthRetryableFetchError'
  ) {
    return 'Cannot reach Supabase. Check .env.local (VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY), restart the dev server, and confirm the project is active in the Supabase dashboard.'
  }

  if (lower.includes('invalid api key') || lower.includes('apikey')) {
    return 'Invalid Supabase API key. Copy the anon or publishable key from Supabase Dashboard → Settings → API keys.'
  }

  if (lower.includes('email rate limit')) {
    return 'Too many signup attempts. Use Log in instead if you already have an account, wait ~1 hour, or raise limits in Supabase → Authentication → Rate Limits. To create the admin account run: npm run seed:admin (requires SUPABASE_SERVICE_ROLE_KEY in .env.local).'
  }

  return msg
}
