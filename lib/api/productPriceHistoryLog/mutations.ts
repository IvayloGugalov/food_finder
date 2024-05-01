import { db_log } from '@/lib/db/index'
import type {
  NewProductPriceHistoryLogParams} from '@/lib/db/schema_log_db/productPriceHistoryLog';
import {
  insertProductPriceHistoryLogSchema,
  productPriceHistoryLog,
} from '@/lib/db/schema_log_db/productPriceHistoryLog'

export const createProductPriceHistoryLog = async (
  productPriceHistoryLogEntity: NewProductPriceHistoryLogParams
) => {
  const newProductPriceHistoryLog =
    insertProductPriceHistoryLogSchema.parse(productPriceHistoryLogEntity)
  try {
    const [p] = await db_log
      .insert(productPriceHistoryLog)
      .values(newProductPriceHistoryLog)
      .returning()
    return { productPriceHistoryLog: p }
  } catch (error) {
    const message = (error as Error).message ?? 'Error, please try again'
    console.error(message)
    throw { error: message }
  }
}
