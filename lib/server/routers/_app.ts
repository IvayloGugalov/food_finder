import { computersRouter } from "./computers";
import { router } from "@/lib/server/trpc";
import { supermarketsRouter } from "./supermarkets";
import { productsRouter } from "./products";
import { shoppingListsRouter } from "./shoppingLists";
import { shoppingProductsRouter } from "./shoppingProducts";
import { productPriceHistoryRouter } from "./productPriceHistory";

export const appRouter = router({
  computers: computersRouter,
  supermarkets: supermarketsRouter,
  products: productsRouter,
  shoppingLists: shoppingListsRouter,
  shoppingProducts: shoppingProductsRouter,
  productPriceHistory: productPriceHistoryRouter,
});

export type AppRouter = typeof appRouter;
