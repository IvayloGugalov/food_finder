import { getShoppingListById, getShoppingLists } from '@/lib/api/shoppingLists/queries'
import { publicProcedure, router } from '@/lib/server/trpc'
import {
  shoppingListIdSchema,
  insertShoppingListParams,
  updateShoppingListParams,
} from '@/lib/db/schema/shoppingLists'
import {
  createShoppingList,
  deleteShoppingList,
  updateShoppingList,
} from '@/lib/api/shoppingLists/mutations'

export const shoppingListsRouter = router({
  getShoppingLists: publicProcedure.query(async () => {
    return getShoppingLists()
  }),
  getShoppingListById: publicProcedure
    .input(shoppingListIdSchema)
    .query(async ({ input }) => {
      return getShoppingListById(input.id)
    }),
  createShoppingList: publicProcedure
    .input(insertShoppingListParams)
    .mutation(async ({ input }) => {
      return createShoppingList(input)
    }),
  updateShoppingList: publicProcedure
    .input(updateShoppingListParams)
    .mutation(async ({ input }) => {
      return updateShoppingList(input.id, input)
    }),
  deleteShoppingList: publicProcedure
    .input(shoppingListIdSchema)
    .mutation(async ({ input }) => {
      return deleteShoppingList(input.id)
    }),
})
