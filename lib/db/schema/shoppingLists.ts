import { sql } from 'drizzle-orm'
import { date, text, timestamp, varchar, pgTable } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

import { type getShoppingLists } from '@/lib/api/shoppingLists/queries'

import { nanoid, timestamps } from '@/lib/utils'

export const shoppingLists = pgTable('shopping_lists', {
  id: varchar('id', { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  description: text('description').notNull(),
  weekDayStart: timestamp('week_day_start').notNull().default(sql`now()`),
  weekDayEnd: timestamp('week_day_end').notNull().default(sql`now()`),
  userId: varchar('user_id', { length: 256 }).notNull(),

  createdAt: timestamp('created_at').notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
})

// Schema for shoppingLists - used to validate API requests
const baseSchema = createSelectSchema(shoppingLists).omit(timestamps)

export const insertShoppingListSchema = createInsertSchema(shoppingLists).omit(timestamps)
export const insertShoppingListParams = baseSchema.omit({
  id: true,
  userId: true,
})

export const updateShoppingListSchema = baseSchema
export const updateShoppingListParams = baseSchema.omit({
  userId: true,
})
export const shoppingListIdSchema = baseSchema.pick({ id: true })
export const shoppingListDateSchema = baseSchema.pick({ weekDayStart: true, weekDayEnd: true })

// Types for shoppingLists - used to type API request params and within Components
export type ShoppingList = typeof shoppingLists.$inferSelect
export type NewShoppingList = z.infer<typeof insertShoppingListSchema>
export type NewShoppingListParams = z.infer<typeof insertShoppingListParams>
export type UpdateShoppingListParams = z.infer<typeof updateShoppingListParams>
export type ShoppingListId = z.infer<typeof shoppingListIdSchema>['id']

// this type infers the return from getShoppingLists() - meaning it will include any joins
export type CompleteShoppingList = Awaited<
  ReturnType<typeof getShoppingLists>
>['shoppingLists'][number]
