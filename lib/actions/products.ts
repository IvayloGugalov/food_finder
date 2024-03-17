'use server'

import { revalidatePath } from 'next/cache'
import { createProduct, deleteProduct, updateProduct } from '@/lib/api/products/mutations'
import {
  ProductId,
  NewProductParams,
  UpdateProductParams,
  productIdSchema,
  insertProductParams,
  updateProductParams,
  CompleteProduct,
} from '@/lib/db/schema/products'
import { getShoppingListByCurrentDate } from '../api/shoppingLists/queries'
import { ShoppingList } from '../db/schema/shoppingLists'
import { getStartAndEndDateOfCurrentWeek, getUtcNow } from '../utils/dateExt'
import { createShoppingListAction } from './shoppingLists'
import { createShoppingProductAction } from './shoppingProducts'
import { getShoppingProductByProductAndShoppingListId } from '../api/shoppingProducts/queries'
import { updateShoppingProduct } from '../api/shoppingProducts/mutations'

const handleErrors = (e: unknown) => {
  const errMsg = 'Error, please try again.'
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg
  if (e && typeof e === 'object' && 'error' in e) {
    const errAsStr = e.error as string
    return errAsStr.length > 0 ? errAsStr : errMsg
  }
  return errMsg
}

const revalidateProducts = () => revalidatePath('/products')

export const createProductAction = async (input: NewProductParams) => {
  try {
    const payload = insertProductParams.parse(input)
    await createProduct(payload)
    revalidateProducts()
  } catch (e) {
    return handleErrors(e)
  }
}

export const updateProductAction = async (input: UpdateProductParams) => {
  try {
    const payload = updateProductParams.parse(input)
    await updateProduct(payload.id, payload)
    revalidateProducts()
  } catch (e) {
    return handleErrors(e)
  }
}

export const deleteProductAction = async (input: ProductId) => {
  try {
    const payload = productIdSchema.parse({ id: input })
    await deleteProduct(payload.id)
    revalidateProducts()
  } catch (e) {
    return handleErrors(e)
  }
}

export const handleAddProdustToCurrentWeekShoppingList = async (product: CompleteProduct) => {
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

      const errorFormatted = {
        error: result ?? 'Error',
        values: pendingShoppingList,
      }
      if (typeof result === 'string') {
        return result
      }
      shoppingList = result.shoppingList
    } catch (e) {
      console.error(e)
      return
    }
  }

  const { shoppingProduct } = await getShoppingProductByProductAndShoppingListId(product.id, shoppingList.id)
  if (shoppingProduct) {
    await updateShoppingProduct(shoppingList.id, { ...shoppingProduct, quantity: shoppingProduct.quantity + 1 })
  } else {
    await createShoppingProductAction({
      productId: product.id,
      shoppingListId: shoppingList.id,
      quantity: 1,
    })
  }
}
