'use client'

import { MouseEventHandler, useEffect, useState, useTransition } from 'react'
import Image from 'next/image'

import { cn } from '@/lib/utils'
import { type Product, CompleteProduct } from '@/lib/db/schema/products'
import { type Supermarket } from '@/lib/db/schema/supermarkets'
import { useOptimisticProducts } from '@/app/(app)/products/useOptimisticProducts'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useFormStatus } from 'react-dom'
import { handleAddProdustToCurrentWeekShoppingList } from '@/lib/actions/products'

export default function ProductList({
  products,
  supermarkets,
}: {
  products: CompleteProduct[]
  supermarkets: Supermarket[]
}) {
  const { optimisticProducts, addOptimisticProduct } = useOptimisticProducts(products, supermarkets)
  const [pending, startMutation] = useTransition()

  const [state, setState] = useState({
    selectedSupermarket: 't339e5lst6r28a4ike0ve' as string,
    filteredProducts: [] as CompleteProduct[],
    activeProduct: null,
  })

  useEffect(() => {
    const filtered = filterProductsBySupermarket(optimisticProducts, state.selectedSupermarket)
    setState((prevState) => ({
      ...prevState,
      filteredProducts: sortProductsByCategory(filtered),
    }))
  }, [optimisticProducts, state.selectedSupermarket])

  const onSuperMarketChanged = (supermarketId: string) => {
    setState((prevState) => ({
      ...prevState,
      selectedSupermarket: supermarketId,
    }))
  }

  const sortProductsByCategory = (products: CompleteProduct[]) => {
    return products.sort((a, b) => {
      const categoryA = a.category ?? '\uffff' // Treat null as an empty string or any other default value
      const categoryB = b.category ?? '\uffff' // Treat null as an empty string or any other default value
      if (categoryA > categoryB) return -1
      if (categoryA < categoryB) return 1
      return 0
    })
  }

  const filterProductsBySupermarket = (products: CompleteProduct[], supermarketId: string) => {
    if (!supermarketId) return products
    return products.filter((p) => p.supermarket?.id === supermarketId)
  }

  return (
    <div>
      <div className='absolute right-0 top-0 '>
        <Button
          onClick={() => console.error('Adding new product by hand is not implemented ')}
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
            <Product
              product={product}
              handleSubmit={() => handleAddProdustToCurrentWeekShoppingList(product)}
              key={product.id}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

const Product = ({
  product,
  handleSubmit,
}: {
  product: CompleteProduct
  handleSubmit: (payload: CompleteProduct) => void
}) => (
  <Card className={cn('flex flex-col justify-between')}>
    <CardContent className='pt-4'>
      <div className='flex justify-center'>
        <Image
          src={product.picUrl ?? '/no-image.jpg'}
          blurDataURL='/no-image.jpg'
          alt='product-image'
          placeholder='blur'
          quality={100}
          width={256}
          height={256}
          style={{
            height: '256px',
            width: '256px',
            objectFit: 'scale-down',
          }}
        />
      </div>
    </CardContent>
    <CardHeader className='pt-0 pb-4 text-center lg:text-left'>
      <CardTitle>{product.name}</CardTitle>
      <CardDescription>{product.category}</CardDescription>
    </CardHeader>
    <CardFooter className='py-[0.75rem] border-t-[1px] flex-row justify-between space-x-2'>
      <div className='flex flex-col gap-1'>
        <p className='text-lg font-medium leading-none'>{product.price} лв.</p>
        {product.oldPrice && (
          <p className='text-sm font-light text-slate-400'>{product.oldPrice} лв.</p>
        )}
      </div>
      <SaveButton onClick={() => handleSubmit(product)} editing={false} />
    </CardFooter>
  </Card>
)

const EmptyState = () => (
  <div className='text-center'>
    <h3 className='mt-2 text-sm font-semibold text-secondary-foreground'>No products</h3>
    <p className='mt-1 text-sm text-muted-foreground'>Get started by creating a new product.</p>
    <div className='mt-6'>
      <Button>
        <PlusIcon className='h-4' /> New Products{' '}
      </Button>
    </div>
  </div>
)

const SaveButton = ({
  editing,
  onClick,
}: {
  editing: boolean
  onClick: MouseEventHandler<HTMLButtonElement>
}) => {
  const { pending } = useFormStatus()
  const isCreating = pending && editing === false
  const isUpdating = pending && editing === true
  return (
    <Button
      type='submit'
      className='mr-2'
      disabled={isCreating || isUpdating}
      aria-disabled={isCreating || isUpdating}
      onClick={onClick}
    >
      {`Add${isCreating ? 'ing' : ''}`} to shopping list{`${isCreating ? '...' : ''}`}
    </Button>
  )
}
