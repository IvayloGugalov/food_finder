import { sql } from 'drizzle-orm'
import { varchar, timestamp, real, pgTable, unique } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { products } from './products'
import { getProductPriceHistories } from '@/lib/api/productPriceHistory/queries'

import { nanoid, timestamps } from '@/lib/utils'

export const productPriceHistory = pgTable(
  'product_price_history',
  {
    id: varchar('id', { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    productId: varchar('product_id', { length: 256 })
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
    weekDayStart: timestamp('week_day_start')
      .notNull()
      .default(sql`now()`),
    weekDayEnd: timestamp('week_day_end')
      .notNull()
      .default(sql`now()`),
    price: real('price').notNull(),
    oldPrice: real('old_price').notNull(),

    createdAt: timestamp('created_at')
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp('updated_at')
      .notNull()
      .default(sql`now()`),
  },
  (productPriceHistories) => ({
    uniqueProductWeek: unique().on(
      productPriceHistories.productId,
      productPriceHistories.weekDayStart,
      productPriceHistories.weekDayEnd
    ),
  })
)
// Schema for productPriceHistory - used to validate API requests
const baseSchema = createSelectSchema(productPriceHistory).omit(timestamps)

export const insertProductPriceHistorySchema = createInsertSchema(productPriceHistory).omit(timestamps)
export const insertProductPriceHistoryParams = baseSchema
  .extend({
    productId: z.coerce.string().min(1),
    price: z.coerce.number(),
    oldPrice: z.coerce.number(),
  })
  .omit({
    id: true,
  })

export const updateProductPriceHistorySchema = baseSchema
export const updateProductPriceHistoryParams = baseSchema.extend({
  productId: z.coerce.string().min(1),
  price: z.coerce.number(),
  oldPrice: z.coerce.number(),
})
export const productPriceHistoryIdSchema = baseSchema.pick({ id: true })

// Types for productPriceHistory - used to type API request params and within Components
export type ProductPriceHistory = typeof productPriceHistory.$inferSelect
export type NewProductPriceHistory = z.infer<typeof insertProductPriceHistorySchema>
export type NewProductPriceHistoryParams = z.infer<typeof insertProductPriceHistoryParams>
export type UpdateProductPriceHistoryParams = z.infer<typeof updateProductPriceHistoryParams>
export type ProductPriceHistoryId = z.infer<typeof productPriceHistoryIdSchema>['id']

// this type infers the return from getProductPriceHistories() - meaning it will include any joins
export type CompleteProductPriceHistory = Awaited<ReturnType<typeof getProductPriceHistories>>['productPriceHistory'][number]
