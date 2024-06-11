import { neon, neonConfig, Pool } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { env } from '@/lib/env.mjs'

const isDevelopment = env.NODE_ENV === 'development'

neonConfig.fetchConnectionCache = true

export const sql = neon(env.DATABASE_URL)
// @ts-expect-error
export const db = drizzle(sql, { logger: isDevelopment })
export const pool = new Pool({ connectionString: env.DATABASE_URL })


export const sql_log = neon(env.DATABASE_APP_LOGS_URL)
// @ts-expect-error
export const db_log = drizzle(sql_log)
export const pool_log = new Pool({ connectionString: env.DATABASE_APP_LOGS_URL })
