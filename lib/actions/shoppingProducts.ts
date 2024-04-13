'use server'

import { revalidatePath } from 'next/cache'
import {
  createShoppingProduct,
  deleteShoppingProduct,
  updateShoppingProduct,
} from '@/lib/api/shoppingProducts/mutations'
import type {
  ShoppingProductId,
  NewShoppingProductParams,
  UpdateShoppingProductParams} from '@/lib/db/schema/shoppingProducts';
import {
  shoppingProductIdSchema,
  insertShoppingProductParams,
  updateShoppingProductParams,
} from '@/lib/db/schema/shoppingProducts'

const handleErrors = (e: unknown) => {
  const errorMessage = 'Error, please try again.'
  if (e instanceof Error) return e.message.length > 0 ? e.message : errorMessage
  if (e && typeof e === 'object' && 'error' in e) {
    const errorAsString = e.error as string
    return errorAsString.length > 0 ? errorAsString : errorMessage
  }
  return errorMessage
}

const revalidateShoppingProducts = () => revalidatePath('/shopping-products')

export const createShoppingProductAction = async (input: NewShoppingProductParams) => {
  try {
    const payload = insertShoppingProductParams.parse(input)
    await createShoppingProduct(payload)
    revalidateShoppingProducts()
  } catch (error) {
    return handleErrors(error)
  }
}

export const updateShoppingProductAction = async (
  input: UpdateShoppingProductParams
) => {
  try {
    const payload = updateShoppingProductParams.parse(input)
    await updateShoppingProduct(payload.id, payload)
    revalidateShoppingProducts()
  } catch (error) {
    return handleErrors(error)
  }
}

export const deleteShoppingProductAction = async (input: ShoppingProductId) => {
  try {
    const payload = shoppingProductIdSchema.parse({ id: input })
    await deleteShoppingProduct(payload.id)
    revalidateShoppingProducts()
  } catch (error) {
    return handleErrors(error)
  }
}
