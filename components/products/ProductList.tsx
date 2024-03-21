'use client'

import { MouseEventHandler, useEffect, useState, useTransition } from 'react'
import Image from 'next/image'

import { Action, cn } from '@/lib/utils'
import { type Product, CompleteProduct } from '@/lib/db/schema/products'
import { type Supermarket } from '@/lib/db/schema/supermarkets'
import { useOptimisticProducts } from '@/app/(app)/products/useOptimisticProducts'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { handleAddProductToCurrentWeekShoppingList } from '@/lib/actions/products'
import {
  ShoppingProduct,
  insertShoppingProductParams,
} from '@/lib/db/schema/shoppingProducts'
import { useValidatedForm } from '@/lib/hooks/useValidatedForm'
import { useRouter } from 'next/navigation'
import { useBackPath } from '../shared/BackButton'
import { toast } from 'sonner'
import { z } from 'zod'

export default function ProductList({
  products,
  supermarkets,
}: {
  products: CompleteProduct[]
  supermarkets: Supermarket[]
}) {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<ShoppingProduct>(insertShoppingProductParams)
  const [pending, startMutation] = useTransition()

  const { optimisticProducts, addOptimisticProduct } = useOptimisticProducts(
    products,
    supermarkets
  )
  const router = useRouter()
  const backpath = useBackPath('products')

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
    const b = products.sort((a, b) => {
      const categoryA = a.category ?? '\uffff' // Treat null as an empty string or any other default value
      const categoryB = b.category ?? '\uffff' // Treat null as an empty string or any other default value
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

  const onSuccess = (
    action: Action,
    data?: { error: string; values: CompleteProduct }
  ) => {
    const failed = Boolean(data?.error)
    if (failed) {
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? 'Error',
      })
    } else {
      router.refresh()
      toast.success(`ShoppingProduct ${action}d!`)
      if (action === 'delete') router.push(backpath)
    }
  }

  const handleSubmitProductToShoppingList = async (product: CompleteProduct) => {
    try {
      startMutation(async () => {
        const error = await handleAddProductToCurrentWeekShoppingList(product)

        const errorFormatted = {
          error: error.values ?? 'Error',
          values: product,
        }
        onSuccess(
          error.action ? 'update' : 'create',
          error.values ? errorFormatted : undefined
        )
      })
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors)
      }
    }
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
              <Product
                product={product}
                handleSubmit={() => {
                  setState((prevState) => ({
                    ...prevState,
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

const Product = ({
  product,
  handleSubmit,
  disabled,
}: {
  product: CompleteProduct
  handleSubmit: (payload: CompleteProduct) => void
  disabled: boolean
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
    <CardFooter className='py-[0.75rem] lg:px-6 px-2 border-t-[1px] flex-row justify-between space-x-2'>
      <div className='flex flex-col gap-1'>
        <p className='text-lg font-medium leading-none'>{product.price} лв.</p>
        {product.oldPrice && (
          <p className='text-sm font-light text-slate-400'>{product.oldPrice} лв.</p>
        )}
      </div>
      <SaveButton onClick={() => handleSubmit(product)} disabled={disabled} />
    </CardFooter>
  </Card>
)

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

const SaveButton = ({
  disabled,
  onClick,
}: {
  disabled: boolean
  onClick: MouseEventHandler<HTMLButtonElement>
}) => {
  return (
    <Button
      type='submit'
      className='mr-2'
      disabled={disabled}
      aria-disabled={disabled}
      onClick={onClick}
    >
      {`Add${disabled ? 'ing' : ''}`} to shopping list{`${disabled ? '...' : ''}`}
    </Button>
  )
}
