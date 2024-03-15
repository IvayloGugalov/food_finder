
import { type ShoppingList, type CompleteShoppingList } from "@/lib/db/schema/shoppingLists";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<ShoppingList>) => void;

export const useOptimisticShoppingLists = (
  shoppingLists: CompleteShoppingList[],
  
) => {
  const [optimisticShoppingLists, addOptimisticShoppingList] = useOptimistic(
    shoppingLists,
    (
      currentState: CompleteShoppingList[],
      action: OptimisticAction<ShoppingList>,
    ): CompleteShoppingList[] => {
      const { data } = action;

      

      const optimisticShoppingList = {
        ...data,
        
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticShoppingList]
            : [...currentState, optimisticShoppingList];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticShoppingList } : item,
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

  return { addOptimisticShoppingList, optimisticShoppingLists };
};
