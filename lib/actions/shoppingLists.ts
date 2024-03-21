'use server'

import { revalidatePath } from 'next/cache'
import {
  createShoppingList,
  deleteShoppingList,
  updateShoppingList,
} from '@/lib/api/shoppingLists/mutations'
import {
  ShoppingListId,
  NewShoppingListParams,
  UpdateShoppingListParams,
  shoppingListIdSchema,
  insertShoppingListParams,
  updateShoppingListParams,
} from '@/lib/db/schema/shoppingLists'

const handleErrors = (e: unknown) => {
  const errMsg = 'Error, please try again.'
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg
  if (e && typeof e === 'object' && 'error' in e) {
    const errAsStr = e.error as string
    return errAsStr.length > 0 ? errAsStr : errMsg
  }
  return errMsg
}

const revalidateShoppingLists = () => revalidatePath('/shopping-lists')

export const createShoppingListAction = async (input: NewShoppingListParams) => {
  try {
    const payload = insertShoppingListParams.parse(input)
    revalidateShoppingLists()
    return await createShoppingList(payload)
  } catch (e) {
    return handleErrors(e)
  }
}

export const updateShoppingListAction = async (input: UpdateShoppingListParams) => {
  try {
    const payload = updateShoppingListParams.parse(input)
    await updateShoppingList(payload.id, payload)
    revalidateShoppingLists()
  } catch (e) {
    return handleErrors(e)
  }
}

export const deleteShoppingListAction = async (input: ShoppingListId) => {
  try {
    const payload = shoppingListIdSchema.parse({ id: input })
    await deleteShoppingList(payload.id)
    revalidateShoppingLists()
  } catch (e) {
    return handleErrors(e)
  }
}
