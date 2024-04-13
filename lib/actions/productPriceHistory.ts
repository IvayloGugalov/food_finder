'use server'

import { revalidatePath } from 'next/cache'
import {
  createProductPriceHistory,
  deleteProductPriceHistory,
  updateProductPriceHistory,
} from '@/lib/api/productPriceHistory/mutations'
import type {
  ProductPriceHistoryId,
  NewProductPriceHistoryParams,
  UpdateProductPriceHistoryParams} from '@/lib/db/schema/productPriceHistory';
import {
  productPriceHistoryIdSchema,
  insertProductPriceHistoryParams,
  updateProductPriceHistoryParams,
} from '@/lib/db/schema/productPriceHistory'

const handleErrors = (e: unknown) => {
  const errorMessage = 'Error, please try again.'
  if (e instanceof Error) return e.message.length > 0 ? e.message : errorMessage
  if (e && typeof e === 'object' && 'error' in e) {
    const errorAsString = e.error as string
    return errorAsString.length > 0 ? errorAsString : errorMessage
  }
  return errorMessage
}

const revalidateProductPriceHistories = () => revalidatePath('/product-price-history')

export const createProductPriceHistoryAction = async (
  input: NewProductPriceHistoryParams
) => {
  try {
    const payload = insertProductPriceHistoryParams.parse(input)
    await createProductPriceHistory(payload)
    revalidateProductPriceHistories()
  } catch (error) {
    return handleErrors(error)
  }
}

export const updateProductPriceHistoryAction = async (
  input: UpdateProductPriceHistoryParams
) => {
  try {
    const payload = updateProductPriceHistoryParams.parse(input)
    await updateProductPriceHistory(payload.id, payload)
    revalidateProductPriceHistories()
  } catch (error) {
    return handleErrors(error)
  }
}

export const deleteProductPriceHistoryAction = async (input: ProductPriceHistoryId) => {
  try {
    const payload = productPriceHistoryIdSchema.parse({ id: input })
    await deleteProductPriceHistory(payload.id)
    revalidateProductPriceHistories()
  } catch (error) {
    return handleErrors(error)
  }
}
