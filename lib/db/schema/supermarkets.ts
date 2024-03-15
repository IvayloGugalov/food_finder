import { sql } from 'drizzle-orm'
import { varchar, timestamp, pgTable, uniqueIndex } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

import { type getSupermarkets } from '@/lib/api/supermarkets/queries'

import { nanoid, timestamps } from '@/lib/utils'

export const supermarkets = pgTable(
  'supermarkets',
  {
    id: varchar('id', { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    name: varchar('name', { length: 256 }).notNull(),

    createdAt: timestamp('created_at')
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp('updated_at')
      .notNull()
      .default(sql`now()`),
  },
  (supermarkets) => {
    return {
      nameIndex: uniqueIndex('supermarket_name_idx').on(supermarkets.name),
    }
  }
)

// Schema for supermarkets - used to validate API requests
const baseSchema = createSelectSchema(supermarkets).omit(timestamps)

export const insertSupermarketSchema = createInsertSchema(supermarkets).omit(timestamps)
export const insertSupermarketParams = baseSchema.extend({}).omit({
  id: true,
})

export const updateSupermarketSchema = baseSchema
export const updateSupermarketParams = baseSchema.extend({})
export const supermarketIdSchema = baseSchema.pick({ id: true })

// Types for supermarkets - used to type API request params and within Components
export type Supermarket = typeof supermarkets.$inferSelect
export type NewSupermarket = z.infer<typeof insertSupermarketSchema>
export type NewSupermarketParams = z.infer<typeof insertSupermarketParams>
export type UpdateSupermarketParams = z.infer<typeof updateSupermarketParams>
export type SupermarketId = z.infer<typeof supermarketIdSchema>['id']

// this type infers the return from getSupermarkets() - meaning it will include any joins
export type CompleteSupermarket = Awaited<ReturnType<typeof getSupermarkets>>['supermarkets'][number]
