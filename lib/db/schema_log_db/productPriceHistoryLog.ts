import { sql } from 'drizzle-orm'
import { varchar, timestamp, real, pgTable, text } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

// import { type getProductPriceHistoryLog } from '@/lib/api/productPriceHistoryLog/queries'

import { nanoid, timestamps } from '@/lib/utils'

export const productPriceHistoryLog = pgTable('product_price_history_log', {
  id: varchar('id', { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  errorMessage: text('error_message'),
  productId: varchar('product_id', { length: 256 }).notNull(),
  productWeekDayStart: timestamp('product_week_day_start').notNull(),
  productWeekDayEnd: timestamp('product_week_day_end').notNull(),
  productPrice: real('product_price').notNull(),
  productOldPrice: real('product_old_price').notNull(),

  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
})

// Schema for productPriceHistoryLog - used to validate API requests
const baseSchema = createSelectSchema(productPriceHistoryLog).omit(timestamps)

export const insertProductPriceHistoryLogSchema =
  createInsertSchema(productPriceHistoryLog).omit(timestamps)
export const insertProductPriceHistoryLogParams = baseSchema
  .extend({
    productWeekDayStart: z.coerce.string().min(1),
    productWeekDayEnd: z.coerce.string().min(1),
    productPrice: z.coerce.number(),
    productOldPrice: z.coerce.number(),
  })
  .omit({
    id: true,
  })

export const updateProductPriceHistoryLogSchema = baseSchema
export const updateProductPriceHistoryLogParams = baseSchema.extend({
  productWeekDayStart: z.coerce.string().min(1),
  productWeekDayEnd: z.coerce.string().min(1),
  productPrice: z.coerce.number(),
  productOldPrice: z.coerce.number(),
})
export const productPriceHistoryLogIdSchema = baseSchema.pick({ id: true })

// Types for productPriceHistoryLog - used to type API request params and within Components
export type ProductPriceHistoryLog = typeof productPriceHistoryLog.$inferSelect
export type NewProductPriceHistoryLog = z.infer<
  typeof insertProductPriceHistoryLogSchema
>
export type NewProductPriceHistoryLogParams = z.infer<
  typeof insertProductPriceHistoryLogParams
>
export type UpdateProductPriceHistoryLogParams = z.infer<
  typeof updateProductPriceHistoryLogParams
>
export type ProductPriceHistoryLogId = z.infer<
  typeof productPriceHistoryLogIdSchema
>['id']

// this type infers the return from getProductPriceHistoryLog() - meaning it will include any joins
// export type CompleteProductPriceHistoryLog = Awaited<
//   ReturnType<typeof getProductPriceHistoryLog>
// >['productPriceHistoryLog'][number]
