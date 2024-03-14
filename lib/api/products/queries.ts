import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type ProductId, productIdSchema, products } from "@/lib/db/schema/products";
import { supermarkets } from "@/lib/db/schema/supermarkets";

export const getProducts = async () => {
  const { session } = await getUserAuth();
  const rows = await db.select({ product: products, supermarket: supermarkets }).from(products).leftJoin(supermarkets, eq(products.supermarketId, supermarkets.id)).where(eq(products.userId, session?.user.id!));
  const p = rows .map((r) => ({ ...r.product, supermarket: r.supermarket})); 
  return { products: p };
};

export const getProductById = async (id: ProductId) => {
  const { session } = await getUserAuth();
  const { id: productId } = productIdSchema.parse({ id });
  const [row] = await db.select({ product: products, supermarket: supermarkets }).from(products).where(and(eq(products.id, productId), eq(products.userId, session?.user.id!))).leftJoin(supermarkets, eq(products.supermarketId, supermarkets.id));
  if (row === undefined) return {};
  const p =  { ...row.product, supermarket: row.supermarket } ;
  return { product: p };
};


