import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function loadEnvFile(filename) {
  const path = resolve(root, filename)
  if (!existsSync(path)) return {}
  const vars = {}
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    vars[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim()
  }
  return vars
}

const envLocal = loadEnvFile('.env.local')
const envExample = loadEnvFile('.env.example')
const env = { ...envExample, ...envLocal }

const url = env.VITE_SUPABASE_URL?.replace(/\/$/, '')
const key = env.VITE_SUPABASE_ANON_KEY
const envSource = existsSync(resolve(root, '.env.local')) ? '.env.local' : '.env.example'

const results = []

function pass(name, detail) {
  results.push({ name, ok: true, detail })
  console.log(`✓ ${name}: ${detail}`)
}

function fail(name, detail) {
  results.push({ name, ok: false, detail })
  console.log(`✗ ${name}: ${detail}`)
}

function authHeaders(accessToken = key) {
  return {
    apikey: key,
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  }
}

console.log('GreenRoute Supabase health check\n')
console.log(`Env source: ${envSource}`)
console.log(`URL: ${url || '(missing)'}\n`)

if (!url || !key || url.includes('your-project') || key.includes('your-anon')) {
  fail('config', 'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local')
  process.exit(1)
}

// 1. Auth service health
try {
  const res = await fetch(`${url}/auth/v1/health`, { headers: { apikey: key } })
  if (res.ok) {
    pass('auth-service', `reachable (HTTP ${res.status})`)
  } else {
    const body = await res.text()
    fail('auth-service', `HTTP ${res.status}: ${body.slice(0, 120)}`)
  }
} catch (err) {
  fail('auth-service', err.message)
}

// 2. Database — profiles table
try {
  const res = await fetch(`${url}/rest/v1/profiles?select=id&limit=1`, {
    headers: { ...authHeaders(), Prefer: 'count=exact' },
  })
  if (res.ok) {
    pass('database-profiles', 'profiles table reachable')
  } else {
    const body = await res.json().catch(() => ({}))
    const msg = body.message || body.error || res.statusText
    if (msg.includes('relation') && msg.includes('does not exist')) {
      fail('database-profiles', 'profiles table missing — run supabase/schema.sql in SQL Editor')
    } else {
      fail('database-profiles', `HTTP ${res.status}: ${msg}`)
    }
  }
} catch (err) {
  fail('database-profiles', err.message)
}

// 3. Signup + profile trigger + signin (skip if profiles table missing)
if (results.some(r => r.name === 'database-profiles' && !r.ok)) {
  console.log('  ↳ Skipping auth-signup/signin — fix database-profiles first')
} else {
const testEmail = `greenroute.healthcheck.${Date.now()}@gmail.com`
const testPassword = `Test_${Date.now()}_Aa1`
let accessToken = null
let userId = null

try {
  const signUpRes = await fetch(`${url}/auth/v1/signup`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
      data: { full_name: 'Health Check User', portal_role: 'farmer' },
    }),
  })
  const signUpBody = await signUpRes.json()

  if (!signUpRes.ok) {
    fail('auth-signup', signUpBody.msg || signUpBody.error_description || signUpBody.message || JSON.stringify(signUpBody))
  } else if (!signUpBody.user?.id) {
    fail('auth-signup', 'No user returned')
  } else {
    userId = signUpBody.user.id
    accessToken = signUpBody.access_token
    const hasSession = !!accessToken
    pass(
      'auth-signup',
      hasSession
        ? `user created with session (${userId.slice(0, 8)}…)`
        : `user created — email confirmation required (${userId.slice(0, 8)}…)`,
    )

    if (hasSession) {
      // profile trigger
      await new Promise(r => setTimeout(r, 500))
      const profileRes = await fetch(
        `${url}/rest/v1/profiles?id=eq.${userId}&select=id,full_name,portal_role`,
        { headers: authHeaders(accessToken) },
      )
      const profiles = await profileRes.json()

      if (!profileRes.ok) {
        fail('auth-profile-trigger', profiles.message || JSON.stringify(profiles))
      } else if (!profiles[0]) {
        fail('auth-profile-trigger', 'No profile row — run supabase/schema.sql trigger')
      } else if (profiles[0].portal_role !== 'farmer') {
        fail('auth-profile-trigger', `Wrong portal_role: ${profiles[0].portal_role}`)
      } else {
        pass('auth-profile-trigger', `profile ok (role: ${profiles[0].portal_role}, name: ${profiles[0].full_name})`)
      }

      // signout then signin
      await fetch(`${url}/auth/v1/logout`, {
        method: 'POST',
        headers: authHeaders(accessToken),
      })

      const signInRes = await fetch(`${url}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ email: testEmail, password: testPassword }),
      })
      const signInBody = await signInRes.json()

      if (!signInRes.ok) {
        fail('auth-signin', signInBody.msg || signInBody.error_description || JSON.stringify(signInBody))
      } else {
        pass('auth-signin', `login ok (${signInBody.user?.email})`)
      }
    } else {
      console.log('  ↳ Skipping profile + sign-in (enable instant login: Auth → Providers → Email → disable Confirm email)')
    }
  }
} catch (err) {
  fail('auth-signup', err.message)
}
}

console.log('\n--- Summary ---')
const failed = results.filter(r => !r.ok)
if (failed.length === 0) {
  console.log('All checks passed.')
  if (envSource === '.env.example') {
    console.log('\nTip: copy .env.example → .env.local so Vite loads credentials in dev.')
  }
  process.exit(0)
} else {
  console.log(`${failed.length} check(s) failed:`)
  failed.forEach(r => console.log(`  - ${r.name}: ${r.detail}`))
  process.exit(1)
}
