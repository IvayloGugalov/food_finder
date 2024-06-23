import { db } from '@/lib/db/index'
import { eq, and, ilike, desc, count, isNotNull, sql } from 'drizzle-orm'
import type { ProductName } from '@/lib/db/schema/products'
import {
  type ProductId,
  productIdSchema,
  products,
  productNameSchema,
} from '@/lib/db/schema/products'
import { type SupermarketId, supermarkets } from '@/lib/db/schema/supermarkets'

export const getTotalProductsCount = async (supermarketId?: SupermarketId) => {
  const rowsCount =
    supermarketId ?
      await db
        .select({ count: count() })
        .from(products)
        .where(and(eq(products.supermarketId, supermarketId)))
    : await db.select({ count: count() }).from(products)

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

export const getPaginatedProducts = async (
  page = 1,
  pageSize = 25,
  supermarketId?: SupermarketId
) => {
  const rows =
    supermarketId ?
      await db
        .select({ product: products, supermarket: supermarkets })
        .from(products)
        .where(and(eq(products.supermarketId, supermarketId)))
        .leftJoin(supermarkets, eq(products.supermarketId, supermarkets.id))
        .orderBy(sql`${products.validUntil} desc nulls last, ${products.name} asc`)
        .limit(pageSize)
        .offset((page - 1) * pageSize)
    : await db
        .select({ product: products, supermarket: supermarkets })
        .from(products)
        .leftJoin(supermarkets, eq(products.supermarketId, supermarkets.id))
        .orderBy(sql`${products.validUntil} desc nulls last, ${products.name} asc`)
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

export const getProductsBasedOnNewProductsToInsert = async (
  products: { name: string; supermarketId: string }[]
): Promise<{
  products: {
    name: string
    supermarketId: string
    validFrom: string
    validUntil: string
  }[]
}> => {
  const whereClauses = products.map(
    (product) => `('${product.name.replaceAll('\'', "''")}', '${product.supermarketId}')`
  )
  const query = sql.raw(`
      SELECT name, supermarket_id, valid_from, valid_until
      FROM products
      WHERE (name, supermarket_id) IN (${whereClauses.join(',')})
  `)
  const result = await db.execute(query)
  const p = result.rows.map((r) => {
    return {
      name: r.name as string,
      supermarketId: r.supermarket_id as string,
      validFrom: r.valid_from as string,
      validUntil: r.valid_until as string,
    }
  })

  return { products: p }
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
