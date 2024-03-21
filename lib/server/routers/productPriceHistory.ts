import {
  getProductPriceHistoryById,
  getProductPriceHistories,
} from '@/lib/api/productPriceHistory/queries'
import { publicProcedure, router } from '@/lib/server/trpc'
import {
  productPriceHistoryIdSchema,
  insertProductPriceHistoryParams,
  updateProductPriceHistoryParams,
} from '@/lib/db/schema/productPriceHistory'
import {
  createProductPriceHistory,
  deleteProductPriceHistory,
  updateProductPriceHistory,
} from '@/lib/api/productPriceHistory/mutations'

export const productPriceHistoryRouter = router({
  getProductPriceHistories: publicProcedure.query(async () => {
    return getProductPriceHistories()
  }),
  getProductPriceHistoryById: publicProcedure
    .input(productPriceHistoryIdSchema)
    .query(async ({ input }) => {
      return getProductPriceHistoryById(input.id)
    }),
  createProductPriceHistory: publicProcedure
    .input(insertProductPriceHistoryParams)
    .mutation(async ({ input }) => {
      return createProductPriceHistory(input)
    }),
  updateProductPriceHistory: publicProcedure
    .input(updateProductPriceHistoryParams)
    .mutation(async ({ input }) => {
      return updateProductPriceHistory(input.id, input)
    }),
  deleteProductPriceHistory: publicProcedure
    .input(productPriceHistoryIdSchema)
    .mutation(async ({ input }) => {
      return deleteProductPriceHistory(input.id)
    }),
})
