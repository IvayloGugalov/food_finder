import { computersRouter } from "./computers";
import { router } from "@/lib/server/trpc";
import { supermarketsRouter } from "./supermarkets";
import { productsRouter } from "./products";
import { shoppingListsRouter } from "./shoppingLists";
import { shoppingProductsRouter } from "./shoppingProducts";

export const appRouter = router({
  computers: computersRouter,
  supermarkets: supermarketsRouter,
  products: productsRouter,
  shoppingLists: shoppingListsRouter,
  shoppingProducts: shoppingProductsRouter,
});

export type AppRouter = typeof appRouter;
