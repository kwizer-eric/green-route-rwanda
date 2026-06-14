import dns from 'dns'
import pg from 'pg'
import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

dns.setDefaultResultOrder('ipv4first')
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

const env = { ...loadEnv('.env.example'), ...loadEnv('.env.local') }
const ref = env.VITE_SUPABASE_URL?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]
const pass = env.SUPABASE_DB_PASSWORD

if (!ref || !pass) {
  console.error('Need VITE_SUPABASE_URL and SUPABASE_DB_PASSWORD in .env.local')
  process.exit(1)
}

const enc = encodeURIComponent(pass)
const regions = [
  'eu-central-1', 'eu-central-2', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-north-1',
  'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'ap-northeast-2', 'ap-south-1', 'ap-south-2',
  'af-south-1', 'sa-east-1', 'ca-central-1', 'me-south-1', 'me-central-1', 'il-central-1',
]

const candidates = [
  `postgresql://postgres:${enc}@db.${ref}.supabase.co:5432/postgres`,
  `postgresql://postgres:${enc}@db.${ref}.supabase.co:6543/postgres`,
]

for (const prefix of ['aws-0', 'aws-1']) {
  for (const region of regions) {
    for (const port of [5432, 6543]) {
      candidates.push(
        `postgresql://postgres.${ref}:${enc}@${prefix}-${region}.pooler.supabase.com:${port}/postgres`,
      )
    }
  }
}

let lastError = null
for (const url of candidates) {
  const host = url.split('@')[1]?.split('/')[0]
  const client = new pg.Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
  })
  try {
    await client.connect()
    await client.query('select 1 as ok')
    console.log(`FOUND ${host}`)
    console.log(`DATABASE_URL=${url}`)
    await client.end()
    process.exit(0)
  } catch (err) {
    lastError = err
    const msg = err.message || ''
    if (!msg.includes('tenant/user') && !msg.includes('ENOTFOUND') && !msg.includes('ENETUNREACH') && !msg.includes('timeout')) {
      console.log(`${host}: ${msg.slice(0, 90)}`)
    }
    await client.end().catch(() => {})
  }
}

console.error('No working connection found.')
if (lastError) console.error('Last error:', lastError.message)
console.error('\nCopy the Session pooler URI from Supabase Dashboard → Connect → ORM/Prisma')
console.error('Add it to .env.local as DATABASE_URL=... then run npm run db:migrate')
process.exit(1)
