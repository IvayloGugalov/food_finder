import { db } from '@/lib/db/index'
import { and, eq } from 'drizzle-orm'
import type {
  ShoppingListId,
  NewShoppingListParams,
  UpdateShoppingListParams} from '@/lib/db/schema/shoppingLists';
import {
  updateShoppingListSchema,
  insertShoppingListSchema,
  shoppingLists,
  shoppingListIdSchema,
} from '@/lib/db/schema/shoppingLists'
import { getUserAuth } from '@/lib/auth/utils'

export const createShoppingList = async (shoppingList: NewShoppingListParams) => {
  const { session } = await getUserAuth()
  const newShoppingList = insertShoppingListSchema.parse({
    ...shoppingList,
    userId: session?.user.id!,
  })
  try {
    const [s] = await db.insert(shoppingLists).values(newShoppingList).returning()
    return { shoppingList: s }
  } catch (error) {
    const message = (error as Error).message ?? 'Error, please try again'
    console.error(message)
    throw { error: message }
  }
}

export const updateShoppingList = async (
  id: ShoppingListId,
  shoppingList: UpdateShoppingListParams
) => {
  const { session } = await getUserAuth()
  const { id: shoppingListId } = shoppingListIdSchema.parse({ id })
  const newShoppingList = updateShoppingListSchema.parse({
    ...shoppingList,
    userId: session?.user.id!,
  })
  try {
    const [s] = await db
      .update(shoppingLists)
      .set({ ...newShoppingList, updatedAt: new Date() })
      .where(
        and(
          eq(shoppingLists.id, shoppingListId!),
          eq(shoppingLists.userId, session?.user.id!)
        )
      )
      .returning()
    return { shoppingList: s }
  } catch (error) {
    const message = (error as Error).message ?? 'Error, please try again'
    console.error(message)
    throw { error: message }
  }
}

export const deleteShoppingList = async (id: ShoppingListId) => {
  const { session } = await getUserAuth()
  const { id: shoppingListId } = shoppingListIdSchema.parse({ id })
  try {
    const [s] = await db
      .delete(shoppingLists)
      .where(
        and(
          eq(shoppingLists.id, shoppingListId!),
          eq(shoppingLists.userId, session?.user.id!)
        )
      )
      .returning()
    return { shoppingList: s }
  } catch (error) {
    const message = (error as Error).message ?? 'Error, please try again'
    console.error(message)
    throw { error: message }
  }
}
