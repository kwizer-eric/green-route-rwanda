import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'
import ws from 'ws'
import { ADMIN_EMAIL } from '../src/lib/auth.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function loadEnv(name) {
  const path = resolve(root, name)
  if (!existsSync(path)) return {}
  const vars = {}
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('=')
    if (eq === -1) continue
    vars[t.slice(0, eq).trim()] = t.slice(eq + 1).trim()
  }
  return vars
}

const env = { ...loadEnv('.env.example'), ...loadEnv('.env.local'), ...process.env }
const url = env.VITE_SUPABASE_URL?.trim()
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY?.trim()
const password = process.argv[2] || '123456'

if (!url || !serviceKey) {
  console.error(`Debug: url=${Boolean(url)} serviceKey=${Boolean(serviceKey)}`)
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  console.error('Get the secret/service role key from Supabase Dashboard → Settings → API keys')
  process.exit(1)
}

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  realtime: { transport: ws },
})

const { data: existing } = await admin.auth.admin.listUsers()
const found = existing?.users?.find(u => u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase())

if (found) {
  const { error } = await admin.auth.admin.updateUserById(found.id, {
    password,
    email_confirm: true,
    user_metadata: { full_name: 'Platform Admin', portal_role: 'admin' },
  })
  if (error) {
    console.error('Failed to update admin user:', error.message)
    process.exit(1)
  }
  console.log(`✓ Admin user updated: ${ADMIN_EMAIL}`)
} else {
  const { data, error } = await admin.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password,
    email_confirm: true,
    user_metadata: { full_name: 'Platform Admin', portal_role: 'admin' },
  })
  if (error) {
    console.error('Failed to create admin user:', error.message)
    process.exit(1)
  }
  console.log(`✓ Admin user created: ${data.user.email}`)
}

console.log('Sign in at /login (do not use signup while rate limits are active)')
