import { defineConfig  } from 'drizzle-kit'
import { env } from '@/lib/env.mjs'

export default defineConfig({
  schema: './lib/db/schema',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})