import { db } from '@/lib/db/index'
import { eq, and } from 'drizzle-orm'
import { type ProductId, productIdSchema, products } from '@/lib/db/schema/products'
import { supermarkets } from '@/lib/db/schema/supermarkets'

export const getProducts = async () => {
  const rows = await db
    .select({ product: products, supermarket: supermarkets })
    .from(products)
    .leftJoin(supermarkets, eq(products.supermarketId, supermarkets.id))
  const p = rows.map((r) => ({ ...r.product, supermarket: r.supermarket }))
  return { products: p }
}

export const getProductById = async (id: ProductId) => {
  const { id: productId } = productIdSchema.parse({ id })
  const [row] = await db
    .select({ product: products, supermarket: supermarkets })
    .from(products)
    .where(and(eq(products.id, productId)))
    .leftJoin(supermarkets, eq(products.supermarketId, supermarkets.id))
  if (row === undefined) return {}
  const p = { ...row.product, supermarket: row.supermarket }
  return { product: p }
}