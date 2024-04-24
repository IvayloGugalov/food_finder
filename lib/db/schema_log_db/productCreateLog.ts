import { sql } from 'drizzle-orm'
import { varchar, real, timestamp, pgTable, text } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

// import { type getProductCreateLog } from '@/lib/api/createProduct/queries'

import { nanoid, timestamps } from '@/lib/utils'

export const productCreateLog = pgTable('product_create_log', {
  id: varchar('id', { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  errorMessage: text('error_message'),
  productName: varchar('product_name', { length: 256 }).notNull(),
  productPrice: real('product_price').notNull(),
  productOldPrice: real('product_old_price'),

  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
})

// Schema for createProduct - used to validate API requests
const baseSchema = createSelectSchema(productCreateLog).omit(timestamps)

export const insertProductCreateLogSchema =
  createInsertSchema(productCreateLog).omit(timestamps)
export const insertProductCreateLogParams = baseSchema
  .extend({
    productPrice: z.coerce.number(),
    productOldPrice: z.coerce.number(),
    productValidFrom: z.coerce.string().min(1),
    productValidUntil: z.coerce.string().min(1),
  })
  .omit({
    id: true,
  })

export const updateProductCreateLogSchema = baseSchema
export const updateProductCreateLogParams = baseSchema.extend({
  productPrice: z.coerce.number(),
  productOldPrice: z.coerce.number(),
  productValidFrom: z.coerce.string().min(1),
  productValidUntil: z.coerce.string().min(1),
})
export const createProductIdSchema = baseSchema.pick({ id: true })

// Types for createProduct - used to type API request params and within Components
export type ProductCreateLog = typeof productCreateLog.$inferSelect
export type NewProductCreateLog = z.infer<typeof insertProductCreateLogSchema>
export type NewProductCreateLogParams = z.infer<typeof insertProductCreateLogParams>
export type UpdateProductCreateLogParams = z.infer<typeof updateProductCreateLogParams>
export type ProductCreateLogId = z.infer<typeof createProductIdSchema>['id']

// // this type infers the return from getProductCreateLog() - meaning it will include any joins
// export type CompleteProductCreateLog = Awaited<
//   ReturnType<typeof getProductCreateLog>
// >['createProduct'][number]
