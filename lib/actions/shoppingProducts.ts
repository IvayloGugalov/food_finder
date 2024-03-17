'use server'

import { revalidatePath } from 'next/cache'
import {
  createShoppingProduct,
  deleteShoppingProduct,
  updateShoppingProduct,
} from '@/lib/api/shoppingProducts/mutations'
import {
  ShoppingProductId,
  NewShoppingProductParams,
  UpdateShoppingProductParams,
  shoppingProductIdSchema,
  insertShoppingProductParams,
  updateShoppingProductParams,
} from '@/lib/db/schema/shoppingProducts'

const handleErrors = (e: unknown) => {
  const errMsg = 'Error, please try again.'
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg
  if (e && typeof e === 'object' && 'error' in e) {
    const errAsStr = e.error as string
    return errAsStr.length > 0 ? errAsStr : errMsg
  }
  return errMsg
}

const revalidateShoppingProducts = () => revalidatePath('/shopping-products')

export const createShoppingProductAction = async (input: NewShoppingProductParams) => {
  try {
    const payload = insertShoppingProductParams.parse(input)
    await createShoppingProduct(payload)
    revalidateShoppingProducts()
  } catch (e) {
    return handleErrors(e)
  }
}

export const updateShoppingProductAction = async (
  input: UpdateShoppingProductParams
) => {
  try {
    const payload = updateShoppingProductParams.parse(input)
    console.log(payload)
    await updateShoppingProduct(payload.id, payload)
    revalidateShoppingProducts()
  } catch (e) {
    return handleErrors(e)
  }
}

export const deleteShoppingProductAction = async (input: ShoppingProductId) => {
  try {
    const payload = shoppingProductIdSchema.parse({ id: input })
    await deleteShoppingProduct(payload.id)
    revalidateShoppingProducts()
  } catch (e) {
    return handleErrors(e)
  }
}
