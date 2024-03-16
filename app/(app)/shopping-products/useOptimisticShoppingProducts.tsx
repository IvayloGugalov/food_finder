import { type Product } from '@/lib/db/schema/products'
import { type ShoppingList } from '@/lib/db/schema/shoppingLists'
import {
  type ShoppingProduct,
  type CompleteShoppingProduct,
} from '@/lib/db/schema/shoppingProducts'
import { OptimisticAction } from '@/lib/utils'
import { useOptimistic } from 'react'

export type TAddOptimistic = (action: OptimisticAction<ShoppingProduct>) => void

export const useOptimisticShoppingProducts = (
  shoppingProducts: CompleteShoppingProduct[],
  products: Product[],
  shoppingLists: ShoppingList[]
) => {
  const [optimisticShoppingProducts, addOptimisticShoppingProduct] = useOptimistic(
    shoppingProducts,
    (
      currentState: CompleteShoppingProduct[],
      action: OptimisticAction<ShoppingProduct>
    ): CompleteShoppingProduct[] => {
      const { data } = action

      const optimisticProduct = products.find((product) => product.id === data.productId)!

      const optimisticShoppingList = shoppingLists.find(
        (shoppingList) => shoppingList.id === data.shoppingListId
      )!

      const optimisticShoppingProduct = {
        ...data,
        product: optimisticProduct,
        shoppingList: optimisticShoppingList,
        id: 'optimistic',
      }

      switch (action.action) {
        case 'create':
          return currentState.length === 0
            ? [optimisticShoppingProduct]
            : [...currentState, optimisticShoppingProduct]
        case 'update':
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticShoppingProduct } : item
          )
        case 'delete':
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: 'delete' } : item
          )
        default:
          return currentState
      }
    }
  )

  return { addOptimisticShoppingProduct, optimisticShoppingProducts }
}
