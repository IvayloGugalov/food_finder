import type { Config } from 'drizzle-kit'
import { env } from '@/lib/env.mjs'

export default {
  schema: './lib/db/schema_log_db',
  out: './lib/db/migrations_log_db',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_APP_LOGS_URL,
  },
} satisfies Config
