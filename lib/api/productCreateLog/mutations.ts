import { db_log } from '@/lib/db/index'
import {
  NewProductCreateLogParams,
  insertProductCreateLogSchema,
  productCreateLog,
} from '@/lib/db/schema_log_db/productCreateLog'

export const createProductCreateLog = async (
  productCreateLogEntity: NewProductCreateLogParams
) => {
  const newProductCreateLog = insertProductCreateLogSchema.parse(productCreateLogEntity)
  try {
    const [c] = await db_log
      .insert(productCreateLog)
      .values(newProductCreateLog)
      .returning()
    return { createProduct: c }
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again'
    console.error(message)
    throw { error: message }
  }
}
