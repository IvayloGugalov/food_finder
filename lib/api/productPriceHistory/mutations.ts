import { db } from '@/lib/db/index'
import { eq } from 'drizzle-orm'
import type {
  ProductPriceHistoryId,
  NewProductPriceHistoryParams,
  UpdateProductPriceHistoryParams} from '@/lib/db/schema/productPriceHistory';
import {
  updateProductPriceHistorySchema,
  insertProductPriceHistorySchema,
  productPriceHistory,
  productPriceHistoryIdSchema,
} from '@/lib/db/schema/productPriceHistory'

export const createProductPriceHistory = async (
  productPrice: NewProductPriceHistoryParams
) => {
  const newProductPriceHistory =
    insertProductPriceHistorySchema.parse(productPrice)
  try {
    const [p] = await db
      .insert(productPriceHistory)
      .values(newProductPriceHistory)
      .returning()
    return { productPriceHistory: p }
  } catch (error) {
    const message = (error as Error).message ?? 'Error, please try again'
    console.error(message)
    throw { error: message }
  }
}

export const updateProductPriceHistory = async (
  id: ProductPriceHistoryId,
  productPrice: UpdateProductPriceHistoryParams
) => {
  const { id: productPriceHistoryId } = productPriceHistoryIdSchema.parse({ id })
  const newProductPriceHistory =
    updateProductPriceHistorySchema.parse(productPrice)
  try {
    const [p] = await db
      .update(productPriceHistory)
      .set({ ...newProductPriceHistory, updatedAt: new Date() })
      .where(eq(productPriceHistory.id, productPriceHistoryId!))
      .returning()
    return { productPriceHistory: p }
  } catch (error) {
    const message = (error as Error).message ?? 'Error, please try again'
    console.error(message)
    throw { error: message }
  }
}

export const deleteProductPriceHistory = async (id: ProductPriceHistoryId) => {
  const { id: productPriceHistoryId } = productPriceHistoryIdSchema.parse({ id })
  try {
    const [p] = await db
      .delete(productPriceHistory)
      .where(eq(productPriceHistory.id, productPriceHistoryId!))
      .returning()
    return { productPriceHistory: p }
  } catch (error) {
    const message = (error as Error).message ?? 'Error, please try again'
    console.error(message)
    throw { error: message }
  }
}
