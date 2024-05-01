import { db } from '@/lib/db/index'
import { eq, and } from 'drizzle-orm'
import {
  type ProductPriceHistoryId,
  productPriceHistoryIdSchema,
  productPriceHistory,
} from '@/lib/db/schema/productPriceHistory'
import type { ProductId} from '@/lib/db/schema/products';
import { productIdSchema, products } from '@/lib/db/schema/products'

export const getAllProductPriceHistories = async () => {
  const rows = await db
    .select({ productPriceHistory: productPriceHistory, product: products })
    .from(productPriceHistory)
    .leftJoin(products, eq(productPriceHistory.productId, products.id))
  const p = rows.map((r) => ({ ...r.productPriceHistory, product: r.product }))
  return { productPriceHistory: p }
}

export const getProductPriceHistories = async (id: ProductId) => {
  const { id: productId } = productIdSchema.parse({ id })
  const rows = await db
    .select({ productPriceHistory: productPriceHistory, product: products })
    .from(productPriceHistory)
    .where(and(eq(productPriceHistory.productId, productId)))
    .leftJoin(products, eq(products.id, productId))
  const p = rows.map((r) => ({ ...r.productPriceHistory, product: r.product }))
  return { productPriceHistory: p }
}

export const getProductPriceHistoryById = async (id: ProductPriceHistoryId) => {
  const { id: productPriceHistoryId } = productPriceHistoryIdSchema.parse({ id })
  const [row] = await db
    .select({ productPriceHistory: productPriceHistory, product: products })
    .from(productPriceHistory)
    .where(eq(productPriceHistory.id, productPriceHistoryId))
    .leftJoin(products, eq(productPriceHistory.productId, products.id))
  if (row === undefined) return {}
  const p = { ...row.productPriceHistory, product: row.product }
  return { productPriceHistory: p }
}
