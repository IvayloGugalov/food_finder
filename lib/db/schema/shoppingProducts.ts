import { varchar, pgTable } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { products } from './products'
import { shoppingLists } from './shoppingLists'
import { type getShoppingProducts } from '@/lib/api/shoppingProducts/queries'

import { nanoid } from '@/lib/utils'

export const shoppingProducts = pgTable('shopping_products', {
  id: varchar('id', { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  productId: varchar('product_id', { length: 256 })
    .references(() => products.id)
    .notNull(),
  shoppingListId: varchar('shopping_list_id', { length: 256 })
    .references(() => shoppingLists.id, { onDelete: 'cascade' })
    .notNull(),
})

// Schema for shoppingProducts - used to validate API requests
const baseSchema = createSelectSchema(shoppingProducts)

export const insertShoppingProductSchema = createInsertSchema(shoppingProducts)
export const insertShoppingProductParams = baseSchema
  .extend({
    productId: z.coerce.string().min(1),
    shoppingListId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
  })

export const updateShoppingProductSchema = baseSchema
export const updateShoppingProductParams = baseSchema.extend({
  productId: z.coerce.string().min(1),
  shoppingListId: z.coerce.string().min(1),
})
export const shoppingProductIdSchema = baseSchema.pick({ id: true })

// Types for shoppingProducts - used to type API request params and within Components
export type ShoppingProduct = typeof shoppingProducts.$inferSelect
export type NewShoppingProduct = z.infer<typeof insertShoppingProductSchema>
export type NewShoppingProductParams = z.infer<typeof insertShoppingProductParams>
export type UpdateShoppingProductParams = z.infer<typeof updateShoppingProductParams>
export type ShoppingProductId = z.infer<typeof shoppingProductIdSchema>['id']

// this type infers the return from getShoppingProducts() - meaning it will include any joins
export type CompleteShoppingProduct = Awaited<ReturnType<typeof getShoppingProducts>>['shoppingProducts'][number]
