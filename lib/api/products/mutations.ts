import { db } from '@/lib/db/index'
import { and, eq } from 'drizzle-orm'
import { NeonDbError } from '@neondatabase/serverless'
import {
  ProductId,
  NewProductParams,
  UpdateProductParams,
  updateProductSchema,
  insertProductSchema,
  products,
  productIdSchema,
} from '@/lib/db/schema/products'

import { createProductPriceHistory } from '@/lib/api/productPriceHistory/mutations'
import { getProductByName } from './queries'

type NewProductType = {
  name: string
  price: number
  supermarketId: string
  id?: string | undefined
  quantity?: string | null | undefined
  oldPrice?: number | null | undefined
  category?: string | null | undefined
  picUrl?: string | null | undefined
  validFrom?: string | null | undefined
  validUntil?: string | null | undefined
}

export const createProduct = async (product: NewProductParams) => {
  const newProduct = insertProductSchema.parse(product)
  try {
    const [p] = await db.insert(products).values(newProduct).returning()
    return { product: p }
  } catch (err) {
    const error = err as NeonDbError
    const errorCode = error.code
    // duplicate key value violates unique constraint
    if (errorCode === '23505') {
      return await createProductAndPriceHistory(newProduct)
    }
    const errorMessage = error.message ?? 'Error, please try again'
    console.error(errorMessage)
    throw { error: errorMessage }
  }
}

const createProductAndPriceHistory = async (newProduct: NewProductType) => {
  const { product } = await getProductByName(newProduct.name)
  if (!product) {
    throw { error: `Could not find product with the name ${newProduct.name}!` }
  }

  await createProductPriceHistory({
    price: newProduct.price,
    productId: product.id,
    oldPrice: product.price,
    weekDayStart: new Date(newProduct.validFrom!),
    weekDayEnd: new Date(newProduct.validUntil!),
  })

  const { product: updatedProduct } = await updateProduct(product.id, {
    ...product,
    oldPrice: product.price,
    price: newProduct.price,
  })

  return { product: updatedProduct }
}

export const createProducts = async (productsToInsert: NewProductParams[]) => {
  const newProducts = productsToInsert.map((product) =>
    insertProductSchema.parse(product)
  )
  try {
    await db
      .insert(products)
      .values(newProducts)
      .onConflictDoNothing()
      .catch((x) => console.error(JSON.stringify(x)))
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again'
    console.error(message)
    throw { error: message }
  }
}

export const updateProduct = async (id: ProductId, product: UpdateProductParams) => {
  const { id: productId } = productIdSchema.parse({ id })
  const newProduct = updateProductSchema.parse(product)
  try {
    const [p] = await db
      .update(products)
      .set({ ...newProduct, updatedAt: new Date() })
      .where(and(eq(products.id, productId!)))
      .returning()
    return { product: p }
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again'
    console.error(message)
    throw { error: message }
  }
}

export const deleteProduct = async (id: ProductId) => {
  const { id: productId } = productIdSchema.parse({ id })
  try {
    const [p] = await db
      .delete(products)
      .where(and(eq(products.id, productId!)))
      .returning()
    return { product: p }
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again'
    console.error(message)
    throw { error: message }
  }
}
