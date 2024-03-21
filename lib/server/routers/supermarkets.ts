import { getSupermarketById, getSupermarkets } from '@/lib/api/supermarkets/queries'
import { publicProcedure, router } from '@/lib/server/trpc'
import {
  supermarketIdSchema,
  insertSupermarketParams,
  updateSupermarketParams,
} from '@/lib/db/schema/supermarkets'
import {
  createSupermarket,
  deleteSupermarket,
  updateSupermarket,
} from '@/lib/api/supermarkets/mutations'

export const supermarketsRouter = router({
  getSupermarkets: publicProcedure.query(async () => {
    return getSupermarkets()
  }),
  getSupermarketById: publicProcedure
    .input(supermarketIdSchema)
    .query(async ({ input }) => {
      return getSupermarketById(input.id)
    }),
  createSupermarket: publicProcedure
    .input(insertSupermarketParams)
    .mutation(async ({ input }) => {
      return createSupermarket(input)
    }),
  updateSupermarket: publicProcedure
    .input(updateSupermarketParams)
    .mutation(async ({ input }) => {
      return updateSupermarket(input.id, input)
    }),
  deleteSupermarket: publicProcedure
    .input(supermarketIdSchema)
    .mutation(async ({ input }) => {
      return deleteSupermarket(input.id)
    }),
})
