import { db } from '@/lib/db/index'
import { eq, and } from 'drizzle-orm'
import { getUserAuth } from '@/lib/auth/utils'
import { type ShoppingListId, shoppingListIdSchema, shoppingLists, shoppingListDateSchema } from '@/lib/db/schema/shoppingLists'
import { shoppingProducts, type CompleteShoppingProduct } from '@/lib/db/schema/shoppingProducts'

export const getShoppingLists = async () => {
  const { session } = await getUserAuth()
  const rows = await db.select().from(shoppingLists).where(eq(shoppingLists.userId, session?.user.id!))
  const s = rows
  return { shoppingLists: s }
}

export const getShoppingListById = async (id: ShoppingListId) => {
  const { session } = await getUserAuth()
  const { id: shoppingListId } = shoppingListIdSchema.parse({ id })
  const [row] = await db
    .select()
    .from(shoppingLists)
    .where(and(eq(shoppingLists.id, shoppingListId), eq(shoppingLists.userId, session?.user.id!)))
  if (row === undefined) return {}
  const s = row
  return { shoppingList: s }
}

export const getShoppingListByCurrentDate = async (startDate: Date, endDate: Date) => {
  const { session } = await getUserAuth()
  const { weekDayStart, weekDayEnd } = shoppingListDateSchema.parse({ weekDayStart: startDate, weekDayEnd: endDate })

  const [row] = await db
    .select()
    .from(shoppingLists)
    .where(
      and(
        eq(shoppingLists.weekDayStart, weekDayStart),
        eq(shoppingLists.weekDayEnd, weekDayEnd),
        eq(shoppingLists.userId, session?.user.id!)
      )
    )
  if (row === undefined) return {}
  const s = row
  return { shoppingList: s }
}

export const getShoppingListByIdWithShoppingProducts = async (id: ShoppingListId) => {
  const { session } = await getUserAuth()
  const { id: shoppingListId } = shoppingListIdSchema.parse({ id })
  const rows = await db
    .select({ shoppingList: shoppingLists, shoppingProduct: shoppingProducts })
    .from(shoppingLists)
    .where(and(eq(shoppingLists.id, shoppingListId), eq(shoppingLists.userId, session?.user.id!)))
    .leftJoin(shoppingProducts, eq(shoppingLists.id, shoppingProducts.shoppingListId))
  if (rows.length === 0) return {}
  const s = rows[0].shoppingList
  const ss = rows.filter((r) => r.shoppingProduct !== null).map((s) => s.shoppingProduct) as CompleteShoppingProduct[]

  return { shoppingList: s, shoppingProducts: ss }
}
