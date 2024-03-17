import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { 
  ProductPriceHistoryId, 
  NewProductPriceHistoryParams,
  UpdateProductPriceHistoryParams, 
  updateProductPriceHistorySchema,
  insertProductPriceHistorySchema, 
  productPriceHistory,
  productPriceHistoryIdSchema 
} from "@/lib/db/schema/productPriceHistory";

export const createProductPriceHistory = async (productPriceHistory: NewProductPriceHistoryParams) => {
  const newProductPriceHistory = insertProductPriceHistorySchema.parse(productPriceHistory);
  try {
    const [p] =  await db.insert(productPriceHistory).values(newProductPriceHistory).returning();
    return { productPriceHistory: p };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateProductPriceHistory = async (id: ProductPriceHistoryId, productPriceHistory: UpdateProductPriceHistoryParams) => {
  const { id: productPriceHistoryId } = productPriceHistoryIdSchema.parse({ id });
  const newProductPriceHistory = updateProductPriceHistorySchema.parse(productPriceHistory);
  try {
    const [p] =  await db
     .update(productPriceHistory)
     .set({...newProductPriceHistory, updatedAt: new Date() })
     .where(eq(productPriceHistory.id, productPriceHistoryId!))
     .returning();
    return { productPriceHistory: p };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteProductPriceHistory = async (id: ProductPriceHistoryId) => {
  const { id: productPriceHistoryId } = productPriceHistoryIdSchema.parse({ id });
  try {
    const [p] =  await db.delete(productPriceHistory).where(eq(productPriceHistory.id, productPriceHistoryId!))
    .returning();
    return { productPriceHistory: p };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

