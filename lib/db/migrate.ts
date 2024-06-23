import { env } from '@/lib/env.mjs'

import { drizzle } from 'drizzle-orm/neon-http'
import { migrate } from 'drizzle-orm/neon-http/migrator'
import { neon, neonConfig } from '@neondatabase/serverless'

const runMigrate = async (migrationsFolder: string, databaseUrl?: string) => {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined')
  }

  neonConfig.fetchConnectionCache = true

  const sql = neon(databaseUrl)
  const database = drizzle(sql)

  console.log('⏳ Running migrations...')

  const start = Date.now()

  await migrate(database, { migrationsFolder: migrationsFolder })

  const end = Date.now()

  console.log('✅ Migrations completed in', end - start, 'ms')

  process.exit(0)
}

runMigrate('lib/db/migrations', env.DATABASE_URL).catch((error) => {
  console.error('❌ Migration failed for Root DB')
  console.error(error)
  process.exit(1)
})

runMigrate('lib/db/migrations_log_db', env.DATABASE_APP_LOGS_URL).catch((error) => {
  console.error('❌ Migration failed for Log DB')
  console.error(error)
  process.exit(1)
})
