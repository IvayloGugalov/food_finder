import {
  getShoppingProductById,
  getShoppingProducts,
} from '@/lib/api/shoppingProducts/queries'
import { publicProcedure, router } from '@/lib/server/trpc'
import {
  shoppingProductIdSchema,
  insertShoppingProductParams,
  updateShoppingProductParams,
} from '@/lib/db/schema/shoppingProducts'
import {
  createShoppingProduct,
  deleteShoppingProduct,
  updateShoppingProduct,
} from '@/lib/api/shoppingProducts/mutations'

export const shoppingProductsRouter = router({
  getShoppingProducts: publicProcedure.query(async () => {
    return getShoppingProducts()
  }),
  getShoppingProductById: publicProcedure
    .input(shoppingProductIdSchema)
    .query(async ({ input }) => {
      return getShoppingProductById(input.id)
    }),
  createShoppingProduct: publicProcedure
    .input(insertShoppingProductParams)
    .mutation(async ({ input }) => {
      return createShoppingProduct(input)
    }),
  updateShoppingProduct: publicProcedure
    .input(updateShoppingProductParams)
    .mutation(async ({ input }) => {
      return updateShoppingProduct(input.id, input)
    }),
  deleteShoppingProduct: publicProcedure
    .input(shoppingProductIdSchema)
    .mutation(async ({ input }) => {
      return deleteShoppingProduct(input.id)
    }),
})
