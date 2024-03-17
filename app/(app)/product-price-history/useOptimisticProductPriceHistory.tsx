import { type Product } from "@/lib/db/schema/products";
import { type ProductPriceHistory, type CompleteProductPriceHistory } from "@/lib/db/schema/productPriceHistory";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<ProductPriceHistory>) => void;

export const useOptimisticProductPriceHistories = (
  productPriceHistory: CompleteProductPriceHistory[],
  products: Product[]
) => {
  const [optimisticProductPriceHistories, addOptimisticProductPriceHistory] = useOptimistic(
    productPriceHistory,
    (
      currentState: CompleteProductPriceHistory[],
      action: OptimisticAction<ProductPriceHistory>,
    ): CompleteProductPriceHistory[] => {
      const { data } = action;

      const optimisticProduct = products.find(
        (product) => product.id === data.productId,
      )!;

      const optimisticProductPriceHistory = {
        ...data,
        product: optimisticProduct,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticProductPriceHistory]
            : [...currentState, optimisticProductPriceHistory];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticProductPriceHistory } : item,
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticProductPriceHistory, optimisticProductPriceHistories };
};
