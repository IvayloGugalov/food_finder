import { db } from '@/lib/db/index'
import { and, eq } from 'drizzle-orm'
import {
  SupermarketId,
  NewSupermarketParams,
  UpdateSupermarketParams,
  updateSupermarketSchema,
  insertSupermarketSchema,
  supermarkets,
  supermarketIdSchema,
} from '@/lib/db/schema/supermarkets'

export const createSupermarket = async (supermarket: NewSupermarketParams) => {
  const newSupermarket = insertSupermarketSchema.parse(supermarket)
  try {
    const [s] = await db.insert(supermarkets).values(newSupermarket).returning()
    return { supermarket: s }
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again'
    console.error(message)
    throw { error: message }
  }
}

export const updateSupermarket = async (
  id: SupermarketId,
  supermarket: UpdateSupermarketParams
) => {
  const { id: supermarketId } = supermarketIdSchema.parse({ id })
  const newSupermarket = updateSupermarketSchema.parse(supermarket)
  try {
    const [s] = await db
      .update(supermarkets)
      .set({ ...newSupermarket, updatedAt: new Date() })
      .where(and(eq(supermarkets.id, supermarketId!)))
      .returning()
    return { supermarket: s }
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again'
    console.error(message)
    throw { error: message }
  }
}

export const deleteSupermarket = async (id: SupermarketId) => {
  const { id: supermarketId } = supermarketIdSchema.parse({ id })
  try {
    const [s] = await db
      .delete(supermarkets)
      .where(and(eq(supermarkets.id, supermarketId!)))
      .returning()
    return { supermarket: s }
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again'
    console.error(message)
    throw { error: message }
  }
}
