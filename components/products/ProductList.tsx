'use client'

import { useEffect, useState } from 'react'

import type { CompleteProduct } from '@/lib/db/schema/products'
import { type Supermarket } from '@/lib/db/schema/supermarkets'
import { useOptimisticProducts } from '@/app/(app)/products/useOptimisticProducts'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { ProductCard } from './ProductCard'
import { useAddShoppingProduct } from '@/lib/hooks/useAddShoppingProduct'

export default function ProductList({
  products,
  supermarkets,
}: {
  products: CompleteProduct[]
  supermarkets: Supermarket[]
}) {
  const {
    errors,
    hasErrors,
    pending,
    handleChange,
    handleSubmitProductToShoppingList,
  } = useAddShoppingProduct()

  const { optimisticProducts, addOptimisticProduct } = useOptimisticProducts(
    products,
    supermarkets
  )

  const [state, setState] = useState({
    // TODO: REMOVE!!!!
    selectedSupermarket: 'zun7p06i1uu4cu6x3joy1' as string,
    filteredProducts: [] as CompleteProduct[],
    productToAddToShoppingListId: '',
  })

  useEffect(() => {
    const filtered = filterProductsBySupermarket(
      optimisticProducts,
      state.selectedSupermarket
    )
    setState((previousState) => ({
      ...previousState,
      filteredProducts: sortProductsByCategory(filtered),
    }))
  }, [optimisticProducts, state.selectedSupermarket])

  const onSuperMarketChanged = (supermarketId: string) => {
    setState((previousState) => ({
      ...previousState,
      selectedSupermarket: supermarketId,
    }))
  }

  const sortProductsByCategory = (products: CompleteProduct[]) => {
    const b = products.sort((a, b) => {
      const categoryA = a.category ?? '\uFFFF' // Treat null as an empty string or any other default value
      const categoryB = b.category ?? '\uFFFF' // Treat null as an empty string or any other default value
      if (categoryA > categoryB) return -1
      if (categoryA < categoryB) return 1
      return 0
    })
    return b
  }

  const filterProductsBySupermarket = (
    products: CompleteProduct[],
    supermarketId: string
  ) => {
    if (!supermarketId) return products
    return products.filter((p) => p.supermarket?.id === supermarketId)
  }

  return (
    <div>
      <div className='absolute right-0 top-0 '>
        <Button
          onClick={() =>
            console.error('Adding new product by hand is not implemented ')
          }
          variant={'outline'}
        >
          +
        </Button>
      </div>
      <div className='py-4'>
        <Select onValueChange={onSuperMarketChanged}>
          <SelectTrigger className='w-[240px]'>
            <SelectValue placeholder='Choose supermarket' />
          </SelectTrigger>
          <SelectContent>
            {supermarkets.map((market) => (
              <SelectItem key={market.id} value={market.id}>
                {market.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {state.filteredProducts.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {state.filteredProducts.map((product) => (
            <form key={product.id} onChange={handleChange}>
              <ProductCard
                product={product}
                handleSubmit={() => {
                  setState((previousState) => ({
                    ...previousState,
                    productToAddToShoppingListId: product.id,
                  }))
                  handleSubmitProductToShoppingList(product)
                }}
                disabled={
                  state.productToAddToShoppingListId === product.id &&
                  (pending || hasErrors)
                }
              />
            </form>
          ))}
        </ul>
      )}
    </div>
  )
}

const EmptyState = () => (
  <div className='text-center'>
    <h3 className='mt-2 text-sm font-semibold text-secondary-foreground'>
      No products
    </h3>
    <p className='mt-1 text-sm text-muted-foreground'>
      Get started by creating a new product.
    </p>
    <div className='mt-6'>
      <Button>
        <PlusIcon className='h-4' /> New Products{' '}
      </Button>
    </div>
  </div>
)
