import { computersRouter } from "./computers";
import { router } from "@/lib/server/trpc";
import { supermarketsRouter } from "./supermarkets";
import { productsRouter } from "./products";

export const appRouter = router({
  computers: computersRouter,
  supermarkets: supermarketsRouter,
  products: productsRouter,
});

export type AppRouter = typeof appRouter;
