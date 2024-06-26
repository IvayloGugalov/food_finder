import { getProductById, getAllProducts } from '@/lib/api/products/queries'
import { publicProcedure, router } from '@/lib/server/trpc'
import {
  productIdSchema,
  insertProductParams,
  updateProductParams,
} from '@/lib/db/schema/products'
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from '@/lib/api/products/mutations'

export const productsRouter = router({
  getAllProducts: publicProcedure.query(async () => {
    return getAllProducts()
  }),
  getProductById: publicProcedure.input(productIdSchema).query(async ({ input }) => {
    return getProductById(input.id)
  }),
  createProduct: publicProcedure
    .input(insertProductParams)
    .mutation(async ({ input }) => {
      return createProduct(input)
    }),
  updateProduct: publicProcedure
    .input(updateProductParams)
    .mutation(async ({ input }) => {
      return updateProduct(input.id, input)
    }),
  deleteProduct: publicProcedure.input(productIdSchema).mutation(async ({ input }) => {
    return deleteProduct(input.id)
  }),
})
