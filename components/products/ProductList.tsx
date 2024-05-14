'use client'

import { useCallback, useState } from 'react'

import type { CompleteProduct, ProductId } from '@/lib/db/schema/products'
import type { SupermarketId, Supermarket } from '@/lib/db/schema/supermarkets'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ProductCard } from './ProductCard'
import { useAddShoppingProduct } from '@/lib/hooks/useAddShoppingProduct'

import { cn } from '@/lib/utils'
import Icon from '@/components/ui/icon'
import { Input } from '@/components/ui/input'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function ProductList({
  products,
  supermarkets,
}: {
  products: CompleteProduct[]
  supermarkets: Supermarket[]
}) {
  const [key, setKey] = useState<number>(+Date.now())
  const router = useRouter()
  const pathname = usePathname()
  const searchParameters = useSearchParams()

  const {
    errors,
    hasErrors,
    pending,
    handleChange,
    handleSubmitProductToShoppingList,
  } = useAddShoppingProduct()

  const [state, setState] = useState<{
    selectedSupermarket?: SupermarketId
    productToAddToShoppingListId?: ProductId
  }>({
    selectedSupermarket: undefined,
    productToAddToShoppingListId: undefined,
  })

  const onSuperMarketChanged = (supermarketId: string) => {
    setState((previousState) => {
      router.push(pathname + '?' + createQueryString('supermarket', supermarketId))

      return {
        ...previousState,
        selectedSupermarket: supermarketId,
      }
    })
  }

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const parameters = new URLSearchParams(searchParameters.toString())
      parameters.set(name, value)

      return parameters.toString()
    },
    [searchParameters]
  )

  const removeQueryString = useCallback(
    (name: string) => {
      const parameters = new URLSearchParams(searchParameters.toString())
      //  eslint-disable-next-line drizzle/enforce-delete-with-where
      parameters.delete(name)

      return parameters.toString()
    },
    [searchParameters]
  )

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    const target = event.target as HTMLFormElement
    const form = new FormData(target)
    const { productsSearch } = Object.fromEntries(form.entries()) as {
      productsSearch: string
    }

    // startTransition(async () => {
    //   const res = await fetch('/api/account', {
    //     method: 'PUT',
    //     body: JSON.stringify({ productsSearch }),
    //     headers: { 'Content-Type': 'application/json' },
    //   })
    //   console.log(res.body)
    //   // router.refresh()
    // })
  }

  return (
    <div>
      <form
        // onSubmit={handleSubmit}
        className='w-full flex items-center rounded-2xl py-2 px-4'
      >
        <Input
          name='productsSearch'
          placeholder='Search products...'
          type='text'
          className={cn('shadow-md')}
        />
        <Button type='submit' variant={'ghost'}>
          <Icon
            icon='search'
            size='30'
            className={
              'hover:scale-110 transition-transform duration-300 cursor-pointer'
            }
          />
        </Button>
      </form>

      {/* <div className='absolute right-0 top-0 '>
        <Button
          onClick={() =>
            console.error('Adding new product by hand is not implemented ')
          }
          variant={'outline'}
        >
          +
        </Button>
      </div> */}

      <div className='py-4 flex gap-14'>

        <div className='flex flex-row items-start justify-start gap-2'>
          {state.selectedSupermarket && (
            <Button
              type='reset'
              variant={'secondary'}
              size={'icon'}
              onClick={() => {
                setKey(+Date.now())
                router.push(pathname + '?' + removeQueryString('supermarket'))
                setState((previous) => ({
                  ...previous,
                  selectedSupermarket: undefined,
                }))
              }}
            >
              <Icon color='white' icon='trash' size='25' />
            </Button>
          )}
          <Select
            key={key}
            value={state.selectedSupermarket ?? ''}
            onValueChange={onSuperMarketChanged}
          >
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

        <div className='flex gap-2 items-center'>
          <div>
            <p>Per page:</p>
          </div>
          <Select
            defaultValue={searchParameters.get('limit') ?? '25'}
            onValueChange={(e) =>
              router.push(pathname + '?' + createQueryString('limit', e))
            }
          >
            <SelectTrigger className='w-[80px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className='w-[80px]'>
              {[25, 50, 100].map((index) => (
                <SelectItem key={index} value={index.toString()}>
                  {index}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {products.length === 0 ?
        <EmptyState />
      : <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'>
          {products.map((product) => (
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
      }
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
