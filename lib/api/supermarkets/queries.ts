import { db } from '@/lib/db/index'
import { eq, and } from 'drizzle-orm'
import { getUserAuth } from '@/lib/auth/utils'
import { type SupermarketId, supermarketIdSchema, supermarkets } from '@/lib/db/schema/supermarkets'
import { products, type CompleteProduct } from '@/lib/db/schema/products'

export const getSupermarkets = async () => {
  const rows = await db.select().from(supermarkets)
  const s = rows
  return { supermarkets: s }
}

export const getSupermarketById = async (id: SupermarketId) => {
  const { id: supermarketId } = supermarketIdSchema.parse({ id })
  const [row] = await db
    .select()
    .from(supermarkets)
    .where(and(eq(supermarkets.id, supermarketId)))
  if (row === undefined) return {}
  const s = row
  return { supermarket: s }
}

export const getSupermarketByIdWithProducts = async (id: SupermarketId) => {
  const { id: supermarketId } = supermarketIdSchema.parse({ id })
  const rows = await db
    .select({ supermarket: supermarkets, product: products })
    .from(supermarkets)
    .where(and(eq(supermarkets.id, supermarketId)))
    .leftJoin(products, eq(supermarkets.id, products.supermarketId))
  if (rows.length === 0) return {}
  const s = rows[0].supermarket
  const sp = rows.filter((r) => r.product !== null).map((p) => p.product) as CompleteProduct[]

  return { supermarket: s, products: sp }
}
