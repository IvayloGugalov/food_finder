import { sql } from 'drizzle-orm'
import { varchar, real, text, date, timestamp, pgTable, uniqueIndex } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { supermarkets } from './supermarkets'
import { type getProducts } from '@/lib/api/products/queries'

import { nanoid, timestamps } from '@/lib/utils'

export const products = pgTable(
  'products',
  {
    id: varchar('id', { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    name: varchar('name', { length: 256 }).notNull(),
    quantity: varchar('quantity', { length: 256 }),
    price: real('price').notNull(),
    oldPrice: real('old_price'),
    category: varchar('category', { length: 256 }),
    picUrl: text('pic_url'),
    validFrom: date('valid_from'),
    validUntil: date('valid_until'),
    supermarketId: varchar('supermarket_id', { length: 256 })
      .references(() => supermarkets.id, { onDelete: 'cascade' })
      .notNull(),

    createdAt: timestamp('created_at')
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp('updated_at')
      .notNull()
      .default(sql`now()`),
  },
  (products) => {
    return {
      nameIndex: uniqueIndex('product_name_idx').on(products.name),
    }
  }
)

// Schema for products - used to validate API requests
const baseSchema = createSelectSchema(products).omit(timestamps)

export const insertProductSchema = createInsertSchema(products).omit(timestamps)
export const insertProductParams = baseSchema
  .extend({
    price: z.coerce.number(),
    oldPrice: z.coerce.number(),
    validFrom: z.coerce.string().min(1),
    validUntil: z.coerce.string().min(1),
    supermarketId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
  })

export const updateProductSchema = baseSchema
export const updateProductParams = baseSchema.extend({
  price: z.coerce.number(),
  oldPrice: z.coerce.number(),
  validFrom: z.coerce.string().min(1),
  validUntil: z.coerce.string().min(1),
  supermarketId: z.coerce.string().min(1),
})

export const productIdSchema = baseSchema.pick({ id: true })

// Types for products - used to type API request params and within Components
export type Product = typeof products.$inferSelect
export type NewProduct = z.infer<typeof insertProductSchema>
export type NewProductParams = z.infer<typeof insertProductParams>
export type UpdateProductParams = z.infer<typeof updateProductParams>
export type ProductId = z.infer<typeof productIdSchema>['id']

// this type infers the return from getProducts() - meaning it will include any joins
export type CompleteProduct = Awaited<ReturnType<typeof getProducts>>['products'][number]
