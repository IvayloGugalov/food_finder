'use server'

import { revalidatePath } from 'next/cache'
import {
  createShoppingList,
  deleteShoppingList,
  updateShoppingList,
} from '@/lib/api/shoppingLists/mutations'
import type {
  ShoppingListId,
  NewShoppingListParams,
  UpdateShoppingListParams} from '@/lib/db/schema/shoppingLists';
import {
  shoppingListIdSchema,
  insertShoppingListParams,
  updateShoppingListParams,
} from '@/lib/db/schema/shoppingLists'

const handleErrors = (e: unknown) => {
  const errorMessage = 'Error, please try again.'
  if (e instanceof Error) return e.message.length > 0 ? e.message : errorMessage
  if (e && typeof e === 'object' && 'error' in e) {
    const errorAsString = e.error as string
    return errorAsString.length > 0 ? errorAsString : errorMessage
  }
  return errorMessage
}

const revalidateShoppingLists = () => revalidatePath('/shopping-lists')

export const createShoppingListAction = async (input: NewShoppingListParams) => {
  try {
    const payload = insertShoppingListParams.parse(input)
    revalidateShoppingLists()
    return await createShoppingList(payload)
  } catch (error) {
    return handleErrors(error)
  }
}

export const updateShoppingListAction = async (input: UpdateShoppingListParams) => {
  try {
    const payload = updateShoppingListParams.parse(input)
    await updateShoppingList(payload.id, payload)
    revalidateShoppingLists()
  } catch (error) {
    return handleErrors(error)
  }
}

export const deleteShoppingListAction = async (input: ShoppingListId) => {
  try {
    const payload = shoppingListIdSchema.parse({ id: input })
    await deleteShoppingList(payload.id)
    revalidateShoppingLists()
  } catch (error) {
    return handleErrors(error)
  }
}
