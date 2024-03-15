import { sql } from 'drizzle-orm'
import { interval, text, timestamp, varchar, pgTable } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

import { type getShoppingLists } from '@/lib/api/shoppingLists/queries'

import { nanoid, timestamps } from '@/lib/utils'

export const shoppingLists = pgTable('shopping_lists', {
  id: varchar('id', { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  description: text('description').notNull(),
  weekPeriod: interval('week_period').notNull(),
  userId: varchar('user_id', { length: 256 }).notNull(),

  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
})

// Schema for shoppingLists - used to validate API requests
const baseSchema = createSelectSchema(shoppingLists).omit(timestamps)

export const insertShoppingListSchema = createInsertSchema(shoppingLists).omit(timestamps)
export const insertShoppingListParams = baseSchema
  .extend({
    weekPeriod: z.coerce.date(),
  })
  .omit({
    id: true,
    userId: true,
  })

export const updateShoppingListSchema = baseSchema
export const updateShoppingListParams = baseSchema
  .extend({
    weekPeriod: z.coerce.date(),
  })
  .omit({
    userId: true,
  })
export const shoppingListIdSchema = baseSchema.pick({ id: true })

// Types for shoppingLists - used to type API request params and within Components
export type ShoppingList = typeof shoppingLists.$inferSelect
export type NewShoppingList = z.infer<typeof insertShoppingListSchema>
export type NewShoppingListParams = z.infer<typeof insertShoppingListParams>
export type UpdateShoppingListParams = z.infer<typeof updateShoppingListParams>
export type ShoppingListId = z.infer<typeof shoppingListIdSchema>['id']

// this type infers the return from getShoppingLists() - meaning it will include any joins
export type CompleteShoppingList = Awaited<ReturnType<typeof getShoppingLists>>['shoppingLists'][number]
