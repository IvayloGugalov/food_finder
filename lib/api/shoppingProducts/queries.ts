import { db } from '@/lib/db/index'
import { eq, and } from 'drizzle-orm'
import {
  type ShoppingProductId,
  shoppingProductIdSchema,
  shoppingProducts,
  shoppingProductProductAndShoppingListIdSchema,
} from '@/lib/db/schema/shoppingProducts'
import { ProductId, products } from '@/lib/db/schema/products'
import { ShoppingListId, shoppingLists } from '@/lib/db/schema/shoppingLists'

export const getShoppingProducts = async () => {
  const rows = await db
    .select({
      shoppingProduct: shoppingProducts,
      product: products,
      shoppingList: shoppingLists,
    })
    .from(shoppingProducts)
    .leftJoin(products, eq(shoppingProducts.productId, products.id))
    .leftJoin(shoppingLists, eq(shoppingProducts.shoppingListId, shoppingLists.id))
  const s = rows.map((r) => ({
    ...r.shoppingProduct,
    product: r.product,
    shoppingList: r.shoppingList,
  }))
  return { shoppingProducts: s }
}

export const getShoppingProductById = async (id: ShoppingProductId) => {
  const { id: shoppingProductId } = shoppingProductIdSchema.parse({ id })
  const [row] = await db
    .select({
      shoppingProduct: shoppingProducts,
      product: products,
      shoppingList: shoppingLists,
    })
    .from(shoppingProducts)
    .where(eq(shoppingProducts.id, shoppingProductId))
    .leftJoin(products, eq(shoppingProducts.productId, products.id))
    .leftJoin(shoppingLists, eq(shoppingProducts.shoppingListId, shoppingLists.id))
  if (row === undefined) return {}
  const s = {
    ...row.shoppingProduct,
    product: row.product,
    shoppingList: row.shoppingList,
  }
  return { shoppingProduct: s }
}

export const getShoppingProductByProductAndShoppingListId = async (
  productId: ProductId,
  shoppingListId: ShoppingListId
) => {
  const { productId: ogProductId, shoppingListId: listId } =
    shoppingProductProductAndShoppingListIdSchema.parse({
      productId,
      shoppingListId,
    })
  const [row] = await db
    .select({ shoppingProduct: shoppingProducts })
    .from(shoppingProducts)
    .where(
      and(
        eq(shoppingProducts.productId, ogProductId),
        eq(shoppingProducts.shoppingListId, listId)
      )
    )
  if (row === undefined) return {}
  return { shoppingProduct: row.shoppingProduct }
}
