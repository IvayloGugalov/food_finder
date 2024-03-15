import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { type ShoppingProductId, shoppingProductIdSchema, shoppingProducts } from "@/lib/db/schema/shoppingProducts";
import { products } from "@/lib/db/schema/products";
import { shoppingLists } from "@/lib/db/schema/shoppingLists";

export const getShoppingProducts = async () => {
  const rows = await db.select({ shoppingProduct: shoppingProducts, product: products, shoppingList: shoppingLists }).from(shoppingProducts).leftJoin(products, eq(shoppingProducts.productId, products.id)).leftJoin(shoppingLists, eq(shoppingProducts.shoppingListId, shoppingLists.id));
  const s = rows .map((r) => ({ ...r.shoppingProduct, product: r.product, shoppingList: r.shoppingList})); 
  return { shoppingProducts: s };
};

export const getShoppingProductById = async (id: ShoppingProductId) => {
  const { id: shoppingProductId } = shoppingProductIdSchema.parse({ id });
  const [row] = await db.select({ shoppingProduct: shoppingProducts, product: products, shoppingList: shoppingLists }).from(shoppingProducts).where(eq(shoppingProducts.id, shoppingProductId)).leftJoin(products, eq(shoppingProducts.productId, products.id)).leftJoin(shoppingLists, eq(shoppingProducts.shoppingListId, shoppingLists.id));
  if (row === undefined) return {};
  const s =  { ...row.shoppingProduct, product: row.product, shoppingList: row.shoppingList } ;
  return { shoppingProduct: s };
};


