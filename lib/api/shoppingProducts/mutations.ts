import { db } from '@/lib/db/index'
import { eq } from 'drizzle-orm'
import type {
  ShoppingProductId,
  NewShoppingProductParams,
  UpdateShoppingProductParams} from '@/lib/db/schema/shoppingProducts';
import {
  updateShoppingProductSchema,
  insertShoppingProductSchema,
  shoppingProducts,
  shoppingProductIdSchema,
} from '@/lib/db/schema/shoppingProducts'

export const createShoppingProduct = async (
  shoppingProduct: NewShoppingProductParams
) => {
  const newShoppingProduct = insertShoppingProductSchema.parse(shoppingProduct)
  try {
    const [s] = await db.insert(shoppingProducts).values(newShoppingProduct).returning()
    return { shoppingProduct: s }
  } catch (error) {
    const message = (error as Error).message ?? 'Error, please try again'
    console.error(message)
    throw { error: message }
  }
}

export const updateShoppingProduct = async (
  id: ShoppingProductId,
  shoppingProduct: UpdateShoppingProductParams
) => {
  const { id: shoppingProductId } = shoppingProductIdSchema.parse({ id })
  const newShoppingProduct = updateShoppingProductSchema.parse(shoppingProduct)

  try {
    const [s] = await db
      .update(shoppingProducts)
      .set(newShoppingProduct)
      .where(eq(shoppingProducts.id, shoppingProductId!))
      .returning()

    return { shoppingProduct: s }
  } catch (error) {
    const message = (error as Error).message ?? 'Error, please try again'
    console.error(message)
    throw { error: message }
  }
}

export const deleteShoppingProduct = async (id: ShoppingProductId) => {
  const { id: shoppingProductId } = shoppingProductIdSchema.parse({ id })
  try {
    const [s] = await db
      .delete(shoppingProducts)
      .where(eq(shoppingProducts.id, shoppingProductId!))
      .returning()
    return { shoppingProduct: s }
  } catch (error) {
    const message = (error as Error).message ?? 'Error, please try again'
    console.error(message)
    throw { error: message }
  }
}
