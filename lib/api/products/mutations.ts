import { db } from '@/lib/db/index'
import { and, eq } from 'drizzle-orm'
import {
  ProductId,
  NewProductParams,
  UpdateProductParams,
  updateProductSchema,
  insertProductSchema,
  products,
  productIdSchema,
} from '@/lib/db/schema/products'

export const createProduct = async (product: NewProductParams) => {
  const newProduct = insertProductSchema.parse(product)
  try {
    const [p] = await db.insert(products).values(newProduct).returning()
    return { product: p }
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again'
    console.error(message)
    throw { error: message }
  }
}

export const createProducts = async (pproducts: NewProductParams[]) => {
  const newProducts = pproducts.map(product => insertProductSchema.parse(product))
  try {
    await db.insert(products).values(newProducts)
      .onConflictDoNothing().catch((x) => console.error(JSON.stringify(x)))
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
