import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) {
    console.warn('[vite] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local')
  }

  return {
    plugins: [react(), tailwindcss()],
    envDir: '.',
    server: {
      host: '127.0.0.1',
      port: 5173,
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.mjs', '.cjs'],
    },
  }
})
