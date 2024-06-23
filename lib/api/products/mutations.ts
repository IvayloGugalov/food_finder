import { db, db_log } from '@/lib/db/index'
import { and, eq } from 'drizzle-orm'
import type { NeonDbError } from '@neondatabase/serverless'
import type {
  ProductId,
  NewProductParams,
  UpdateProductParams,
} from '@/lib/db/schema/products'
import {
  updateProductSchema,
  insertProductSchema,
  products,
  productIdSchema,
} from '@/lib/db/schema/products'

import { createProductPriceHistory } from '@/lib/api/productPriceHistory/mutations'
import { getProductByName, getProductsBasedOnNewProductsToInsert as getExistingProducts } from './queries'
import {
  insertProductCreateLogSchema,
  productCreateLog,
} from '@/lib/db/schema_log_db/productCreateLog'

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

const DUPLICATE_UNIQUE_CONSTRAIN_ERROR_CODE = '23505'

export const createProduct = async (product: NewProductParams) => {
  const newProduct = insertProductSchema.parse(product)
  try {
    const [p] = await db.insert(products).values(newProduct).returning()
    return { product: p }
  } catch (error_) {
    const error = error_ as NeonDbError
    const errorCode = error.code
    // duplicate key value violates unique constraint
    // if (errorCode === DUPLICATE_UNIQUE_CONSTRAIN_ERROR_CODE) {
    //   return await createProductAndPriceHistory(newProduct)
    // }
    const errorMessage = error.message ?? 'Error, please try again'

    // const insertProductCreateLog = insertProductCreateLogSchema.parse({
    //   productName: product.name,
    //   productPrice: product.price,
    //   productOldPrice: product.oldPrice,
    //   errorMessage: errorMessage,
    // })
    // await db_log.insert(productCreateLog).values(insertProductCreateLog).catch(x => console.log(JSON.stringify(x)))
    console.error('createProduct', errorMessage)
    throw { error: errorMessage }
  }
}

const createProductAndPriceHistory = async (newProduct: NewProductType) => {
  const { product } = await getProductByName(newProduct.name)
  if (!product) {
    throw { error: `Could not find product with the name ${newProduct.name}!` }
  }

  if (newProduct.validFrom === product.validFrom) {
    throw {
      error: `Product ${newProduct.name} has already been added for ${newProduct.validFrom} - ${newProduct.validUntil} week!`,
    }
  }

  await createProductPriceHistory({
    price: product.price,
    productId: product.id,
    oldPrice: product.oldPrice!,
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
  const { filteredProductsToUpdate, filteredProductsToInsert } =
    await filterProductsForInsertAndUpdate(productsToInsert)

  filteredProductsToUpdate.forEach(async (p) => {
    createProductAndPriceHistory(p).catch((error) => {
      console.error(`Error updating product ${p.name}:`, error)
    })
  })
  const newProducts = filteredProductsToInsert.map((product) =>
    insertProductSchema.parse(product)
  )

  try {
    await db.insert(products)
      .values(newProducts)
      // The cobnflicts should be handled by the filterProductsForInsertAndUpdate function
      .onConflictDoNothing()
  } catch (error) {
    const message = (error as Error).message ?? 'Error, please try again'
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
  } catch (error) {
    const message = (error as Error).message ?? 'Error, please try again'
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
  } catch (error) {
    const message = (error as Error).message ?? 'Error, please try again'
    console.error(message)
    throw { error: message }
  }
}

const createUniqueProductName = (product: NewProductParams) => {
  const validFromFormatted =
    product.validFrom &&
    new Date(product.validFrom).toLocaleDateString('en-GB').replaceAll('/', '-')
  const validUntilFormatted =
    product.validUntil &&
    new Date(product.validUntil).toLocaleDateString('en-GB').replaceAll('/', '-')
  return `${product.name} (${validFromFormatted} - ${validUntilFormatted})`
}

async function filterProductsForInsertAndUpdate(
  productsToInsert: {
    name: string
    quantity: string | null
    price: number
    oldPrice: number
    category: string | null
    picUrl: string | null
    validFrom: string | null
    validUntil: string | null
    supermarketId: string
  }[]
) {
  const { products: existingProducts } = await getExistingProducts(
    productsToInsert.map((p) => ({ name: p.name, supermarketId: p.supermarketId }))
  )

  const filteredProductsToInsert: NewProductParams[] = []
  const filteredProductsToUpdate: NewProductParams[] = []
  productsToInsert.forEach((p) => {
    const existingProduct = existingProducts.find(
      (e) => e.name === p.name && e.supermarketId === p.supermarketId
    )

    if (!existingProduct) {
      filteredProductsToInsert.push(p)
    } else if (
      existingProduct &&
      !!p.validFrom &&
      existingProduct.validFrom < p.validFrom &&
      !!p.validUntil &&
      existingProduct.validUntil < p.validUntil
    ) {
      const uniqueProductName = createUniqueProductName(p)
      filteredProductsToInsert.push({ ...p, name: uniqueProductName })
    }
  })
  return { filteredProductsToUpdate, filteredProductsToInsert }
}
