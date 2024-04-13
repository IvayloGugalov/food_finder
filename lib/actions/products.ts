'use server'

import { revalidatePath } from 'next/cache'
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from '@/lib/api/products/mutations'
import type {
  ProductId,
  NewProductParams,
  UpdateProductParams,
  CompleteProduct} from '@/lib/db/schema/products';
import {
  productIdSchema,
  insertProductParams,
  updateProductParams
} from '@/lib/db/schema/products'
import { getShoppingListByCurrentDate } from '@/lib/api/shoppingLists/queries'
import type { ShoppingList } from '@/lib/db/schema/shoppingLists'
import { getStartAndEndDateOfCurrentWeek, getUtcNow } from '@/lib/utils/dateExt'
import { createShoppingListAction } from './shoppingLists'
import {
  createShoppingProductAction,
  updateShoppingProductAction,
} from './shoppingProducts'
import { getShoppingProductByProductAndShoppingListId } from '@/lib/api/shoppingProducts/queries'
import { updateShoppingProductParams } from '@/lib/db/schema/shoppingProducts'
import { Action } from '@/lib/utils'

const handleErrors = (e: unknown) => {
  const errorMessage = 'Error, please try again.'
  if (e instanceof Error) return e.message.length > 0 ? e.message : errorMessage
  if (e && typeof e === 'object' && 'error' in e) {
    const errorAsString = e.error as string
    return errorAsString.length > 0 ? errorAsString : errorMessage
  }
  return errorMessage
}

const revalidateProducts = () => revalidatePath('/products')

export const createProductAction = async (input: NewProductParams) => {
  try {
    const payload = insertProductParams.parse(input)
    await createProduct(payload)
    revalidateProducts()
  } catch (error) {
    return handleErrors(error)
  }
}

export const updateProductAction = async (input: UpdateProductParams) => {
  try {
    const payload = updateProductParams.parse(input)
    await updateProduct(payload.id, payload)
    revalidateProducts()
  } catch (error) {
    return handleErrors(error)
  }
}

export const deleteProductAction = async (input: ProductId) => {
  try {
    const payload = productIdSchema.parse({ id: input })
    await deleteProduct(payload.id)
    revalidateProducts()
  } catch (error) {
    return handleErrors(error)
  }
}

export const handleAddProductToCurrentWeekShoppingList = async (
  product: CompleteProduct
) => {
  const { startDate, endDate } = getStartAndEndDateOfCurrentWeek()

  let { shoppingList } = await getShoppingListByCurrentDate(startDate, endDate)
  if (!shoppingList) {
    const currentDate = getUtcNow()
    const pendingShoppingList: ShoppingList = {
      updatedAt: currentDate,
      createdAt: currentDate,
      id: '',
      userId: '',
      weekDayStart: startDate,
      weekDayEnd: endDate,
      description: '',
    }
    try {
      const result = await createShoppingListAction(pendingShoppingList)

      if (typeof result === 'string') {
        return { values: handleErrors(result), action: 'update' }
      }
      shoppingList = result.shoppingList
    } catch (error) {
      return { values: handleErrors(error), action: 'update' }
    }
  }

  const { shoppingProduct } = await getShoppingProductByProductAndShoppingListId(
    product.id,
    shoppingList.id
  )

  let result
  let pendingShoppingProduct = shoppingProduct
  try {
    if (shoppingProduct) {
      const payload = updateShoppingProductParams.parse({
        ...shoppingProduct,
        quantity: ++shoppingProduct.quantity,
      })

      // ALWAYS USE THE PAYLOAD ID AS THE REFERENCES SHOULD BE THE SAME !!!!!!!!
      result = { values: await updateShoppingProductAction(payload), action: 'update' }
    } else {
      pendingShoppingProduct = {
        id: '',
        productId: product.id,
        shoppingListId: shoppingList.id,
        quantity: 1,
      }
      result = {
        values: await createShoppingProductAction(pendingShoppingProduct),
        action: 'create',
      }
    }

    return result
  } catch (error) {
    return {
      values: handleErrors(error),
      action: pendingShoppingProduct ? 'create' : 'update',
    }
  }
}
