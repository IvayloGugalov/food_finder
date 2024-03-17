'use server'

import { revalidatePath } from 'next/cache'
import {
  createProductPriceHistory,
  deleteProductPriceHistory,
  updateProductPriceHistory,
} from '@/lib/api/productPriceHistory/mutations'
import {
  ProductPriceHistoryId,
  NewProductPriceHistoryParams,
  UpdateProductPriceHistoryParams,
  productPriceHistoryIdSchema,
  insertProductPriceHistoryParams,
  updateProductPriceHistoryParams,
} from '@/lib/db/schema/productPriceHistory'

const handleErrors = (e: unknown) => {
  const errMsg = 'Error, please try again.'
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg
  if (e && typeof e === 'object' && 'error' in e) {
    const errAsStr = e.error as string
    return errAsStr.length > 0 ? errAsStr : errMsg
  }
  return errMsg
}

const revalidateProductPriceHistories = () => revalidatePath('/product-price-history')

export const createProductPriceHistoryAction = async (
  input: NewProductPriceHistoryParams
) => {
  try {
    const payload = insertProductPriceHistoryParams.parse(input)
    await createProductPriceHistory(payload)
    revalidateProductPriceHistories()
  } catch (e) {
    return handleErrors(e)
  }
}

export const updateProductPriceHistoryAction = async (
  input: UpdateProductPriceHistoryParams
) => {
  try {
    const payload = updateProductPriceHistoryParams.parse(input)
    await updateProductPriceHistory(payload.id, payload)
    revalidateProductPriceHistories()
  } catch (e) {
    return handleErrors(e)
  }
}

export const deleteProductPriceHistoryAction = async (input: ProductPriceHistoryId) => {
  try {
    const payload = productPriceHistoryIdSchema.parse({ id: input })
    await deleteProductPriceHistory(payload.id)
    revalidateProductPriceHistories()
  } catch (e) {
    return handleErrors(e)
  }
}
