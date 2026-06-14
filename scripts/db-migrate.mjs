import { readFileSync, existsSync, readdirSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'
import dns from 'dns'
import pg from 'pg'

dns.setDefaultResultOrder('ipv4first')

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

const env = { ...loadEnvFile('.env.example'), ...loadEnvFile('.env.local') }

const projectRef = env.VITE_SUPABASE_URL?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]
const password = env.SUPABASE_DB_PASSWORD

const POOLER_REGIONS = [
  'eu-central-1', 'eu-central-2', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-north-1',
  'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'ap-northeast-2', 'ap-south-1', 'ap-south-2',
  'af-south-1', 'sa-east-1', 'ca-central-1', 'me-south-1', 'me-central-1', 'il-central-1',
]

function buildCandidateUrls() {
  if (env.DATABASE_URL) return [env.DATABASE_URL]
  if (!projectRef || !password) return []

  const enc = encodeURIComponent(password)
  const urls = [
    `postgresql://postgres:${enc}@db.${projectRef}.supabase.co:5432/postgres`,
    `postgresql://postgres:${enc}@db.${projectRef}.supabase.co:6543/postgres`,
  ]

  for (const prefix of ['aws-0', 'aws-1']) {
    for (const region of POOLER_REGIONS) {
      for (const port of [5432, 6543]) {
        urls.push(
          `postgresql://postgres.${projectRef}:${enc}@${prefix}-${region}.pooler.supabase.com:${port}/postgres`,
        )
      }
    }
  }

  return urls
}

const candidateUrls = buildCandidateUrls()

if (candidateUrls.length === 0) {
  console.error('Missing database connection.')
  console.error('Add to .env.local:')
  console.error('  SUPABASE_DB_PASSWORD=...  (from Dashboard → Settings → Database)')
  console.error('  DATABASE_URL=...          (from Dashboard → Connect → Session pooler URI)')
  process.exit(1)
}

async function connectDatabase() {
  let lastError
  for (const url of candidateUrls) {
    const host = url.split('@')[1]?.split('/')[0]
    const client = new pg.Client({
      connectionString: url,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 6000,
    })
    try {
      await client.connect()
      await client.query('select 1')
      console.log(`Connected via ${host}\n`)
      return client
    } catch (err) {
      lastError = err
      await client.end().catch(() => {})
    }
  }
  throw lastError || new Error('Could not connect to database')
}

const migrationsDir = resolve(root, 'supabase/migrations')
const files = readdirSync(migrationsDir)
  .filter(f => f.endsWith('.sql'))
  .sort()

if (files.length === 0) {
  console.error('No migration files in supabase/migrations/')
  process.exit(1)
}

let client
try {
  client = await connectDatabase()

  await client.query(`
    create table if not exists public.app_migrations (
      version text primary key,
      name text not null,
      applied_at timestamptz not null default now()
    )
  `)

  for (const file of files) {
    const version = file.replace(/_.+$/, '')
    const { rows } = await client.query(
      'select version from public.app_migrations where version = $1',
      [version],
    )
    if (rows.length > 0) {
      console.log(`⏭  ${file} (already applied)`)
      continue
    }

    const sql = readFileSync(join(migrationsDir, file), 'utf8')
    console.log(`▶  Applying ${file}…`)
    await client.query('begin')
    try {
      await client.query(sql)
      await client.query(
        'insert into public.app_migrations (version, name) values ($1, $2)',
        [version, file],
      )
      await client.query('commit')
      console.log(`✓  ${file}`)
    } catch (err) {
      await client.query('rollback')
      throw err
    }
  }

  console.log('\nMigrations complete.')
} catch (err) {
  console.error('\nMigration failed:', err.message)
  console.error('\nIf auto-detect failed, paste your Session pooler URI from')
  console.error('Supabase Dashboard → Connect → ORM/Prisma into .env.local as DATABASE_URL')
  process.exit(1)
} finally {
  if (client) await client.end().catch(() => {})
}
