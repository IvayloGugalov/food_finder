'use server'

import { revalidatePath } from 'next/cache'
import {
  createSupermarket,
  deleteSupermarket,
  updateSupermarket,
} from '@/lib/api/supermarkets/mutations'
import type {
  SupermarketId,
  NewSupermarketParams,
  UpdateSupermarketParams} from '@/lib/db/schema/supermarkets';
import {
  supermarketIdSchema,
  insertSupermarketParams,
  updateSupermarketParams,
} from '@/lib/db/schema/supermarkets'

const handleErrors = (e: unknown) => {
  const errorMessage = 'Error, please try again.'
  if (e instanceof Error) return e.message.length > 0 ? e.message : errorMessage
  if (e && typeof e === 'object' && 'error' in e) {
    const errorAsString = e.error as string
    return errorAsString.length > 0 ? errorAsString : errorMessage
  }
  return errorMessage
}

const revalidateSupermarkets = () => revalidatePath('/supermarkets')

export const createSupermarketAction = async (input: NewSupermarketParams) => {
  try {
    const payload = insertSupermarketParams.parse(input)
    await createSupermarket(payload)
    revalidateSupermarkets()
  } catch (error) {
    return handleErrors(error)
  }
}

export const updateSupermarketAction = async (input: UpdateSupermarketParams) => {
  try {
    const payload = updateSupermarketParams.parse(input)
    await updateSupermarket(payload.id, payload)
    revalidateSupermarkets()
  } catch (error) {
    return handleErrors(error)
  }
}

export const deleteSupermarketAction = async (input: SupermarketId) => {
  try {
    const payload = supermarketIdSchema.parse({ id: input })
    await deleteSupermarket(payload.id)
    revalidateSupermarkets()
  } catch (error) {
    return handleErrors(error)
  }
}
