import { db } from '@/lib/db/index'
import { eq, and, ilike, desc, sql, count } from 'drizzle-orm'
import type { ProductName } from '@/lib/db/schema/products'
import {
  type ProductId,
  productIdSchema,
  products,
  productNameSchema,
} from '@/lib/db/schema/products'
import { supermarkets } from '@/lib/db/schema/supermarkets'

export const getTotalProductsCount = async () => {
  const rowsCount = await db.select({ count: count() }).from(products)

  return { count: rowsCount[0].count }
}

export const getAllProducts = async () => {
  const rows = await db
    .select({ product: products, supermarket: supermarkets })
    .from(products)
    .leftJoin(supermarkets, eq(products.supermarketId, supermarkets.id))
    .orderBy(desc(products.createdAt))
  const p = rows.map((r) => ({ ...r.product, supermarket: r.supermarket }))
  return { products: p }
}

export const getPaginatedProducts = async (page = 1, pageSize = 25) => {
  const rows = await db
    .select({ product: products, supermarket: supermarkets })
    .from(products)
    .leftJoin(supermarkets, eq(products.supermarketId, supermarkets.id))
    .orderBy(desc(products.validUntil))
    .limit(pageSize)
    .offset((page - 1) * pageSize)
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

export const getProductByName = async (name: ProductName) => {
  const { name: productName } = productNameSchema.parse({ name: name })
  const [row] = await db
    .select({ product: products, supermarket: supermarkets })
    .from(products)
    .where(and(eq(products.name, productName)))
    .leftJoin(supermarkets, eq(products.supermarketId, supermarkets.id))
  if (row === undefined) return {}
  const p = { ...row.product, supermarket: row.supermarket }
  return { product: p }
}

export const searchProductsByMatchingName = async (matcher: string) => {
  const rows = await db
    .select({ product: products, supermarket: supermarkets })
    .from(products)
    .where(ilike(products.name, `%${matcher}%`))
    .leftJoin(supermarkets, eq(products.supermarketId, supermarkets.id))
  const p = rows.map((r) => ({ ...r.product, supermarket: r.supermarket }))
  return { products: p }
}
