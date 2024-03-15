import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import {
  SupermarketId,
  NewSupermarketParams,
  UpdateSupermarketParams,
  updateSupermarketSchema,
  insertSupermarketSchema,
  supermarkets,
  supermarketIdSchema
} from "@/lib/db/schema/supermarkets";
import { getUserAuth } from "@/lib/auth/utils";

export const createSupermarket = async (supermarket: NewSupermarketParams) => {
  const { session } = await getUserAuth();
  const newSupermarket = insertSupermarketSchema.parse({ ...supermarket, userId: session?.user.id! });
  try {
    const [s] =  await db.insert(supermarkets).values(newSupermarket).returning();
    return { supermarket: s };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateSupermarket = async (id: SupermarketId, supermarket: UpdateSupermarketParams) => {
  const { session } = await getUserAuth();
  const { id: supermarketId } = supermarketIdSchema.parse({ id });
  const newSupermarket = updateSupermarketSchema.parse({ ...supermarket, userId: session?.user.id! });
  try {
    const [s] =  await db
     .update(supermarkets)
     .set({...newSupermarket, updatedAt: new Date() })
     .where(and(eq(supermarkets.id, supermarketId!), eq(supermarkets.userId, session?.user.id!)))
     .returning();
    return { supermarket: s };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteSupermarket = async (id: SupermarketId) => {
  const { session } = await getUserAuth();
  const { id: supermarketId } = supermarketIdSchema.parse({ id });
  try {
    const [s] =  await db.delete(supermarkets).where(and(eq(supermarkets.id, supermarketId!), eq(supermarkets.userId, session?.user.id!)))
    .returning();
    return { supermarket: s };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

