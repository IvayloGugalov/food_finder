'use server'

import { revalidatePath } from 'next/cache'
import {
  createSupermarket,
  deleteSupermarket,
  updateSupermarket,
} from '@/lib/api/supermarkets/mutations'
import {
  SupermarketId,
  NewSupermarketParams,
  UpdateSupermarketParams,
  supermarketIdSchema,
  insertSupermarketParams,
  updateSupermarketParams,
} from '@/lib/db/schema/supermarkets'

const handleErrors = (e: unknown) => {
  const errMsg = 'Error, please try again.'
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg
  if (e && typeof e === 'object' && 'error' in e) {
    const errAsStr = e.error as string
    return errAsStr.length > 0 ? errAsStr : errMsg
  }
  return errMsg
}

const revalidateSupermarkets = () => revalidatePath('/supermarkets')

export const createSupermarketAction = async (input: NewSupermarketParams) => {
  try {
    const payload = insertSupermarketParams.parse(input)
    await createSupermarket(payload)
    revalidateSupermarkets()
  } catch (e) {
    return handleErrors(e)
  }
}

export const updateSupermarketAction = async (input: UpdateSupermarketParams) => {
  try {
    const payload = updateSupermarketParams.parse(input)
    await updateSupermarket(payload.id, payload)
    revalidateSupermarkets()
  } catch (e) {
    return handleErrors(e)
  }
}

export const deleteSupermarketAction = async (input: SupermarketId) => {
  try {
    const payload = supermarketIdSchema.parse({ id: input })
    await deleteSupermarket(payload.id)
    revalidateSupermarkets()
  } catch (e) {
    return handleErrors(e)
  }
}
