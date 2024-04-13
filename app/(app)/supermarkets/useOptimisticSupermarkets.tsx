import {
  type Supermarket,
  type CompleteSupermarket,
} from '@/lib/db/schema/supermarkets'
import type { OptimisticAction } from '@/lib/utils'
import { useOptimistic } from 'react'

export type TAddOptimistic = (action: OptimisticAction<Supermarket>) => void

export const useOptimisticSupermarkets = (supermarkets: CompleteSupermarket[]) => {
  const [optimisticSupermarkets, addOptimisticSupermarket] = useOptimistic(
    supermarkets,
    (
      currentState: CompleteSupermarket[],
      action: OptimisticAction<Supermarket>
    ): CompleteSupermarket[] => {
      const { data } = action

      const optimisticSupermarket = {
        ...data,

        id: 'optimistic',
      }

      switch (action.action) {
        case 'create': {
          return currentState.length === 0
            ? [optimisticSupermarket]
            : [...currentState, optimisticSupermarket]
        }
        case 'update': {
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticSupermarket } : item
          )
        }
        case 'delete': {
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: 'delete' } : item
          )
        }
        default: {
          return currentState
        }
      }
    }
  )

  return { addOptimisticSupermarket, optimisticSupermarkets }
}
