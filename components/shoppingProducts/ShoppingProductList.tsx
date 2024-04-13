'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import type {
  CompleteShoppingProduct} from '@/lib/db/schema/shoppingProducts';
import {
  type ShoppingProduct
} from '@/lib/db/schema/shoppingProducts'
import Modal from '@/components/shared/Modal'
import { type Product, type ProductId } from '@/lib/db/schema/products'
import { type ShoppingList, type ShoppingListId } from '@/lib/db/schema/shoppingLists'
import { useOptimisticShoppingProducts } from '@/app/(app)/shopping-products/useOptimisticShoppingProducts'
import { Button } from '@/components/ui/button'
import ShoppingProductForm from './ShoppingProductForm'
import { PlusIcon } from 'lucide-react'

type TOpenModal = (shoppingProduct?: ShoppingProduct) => void

export default function ShoppingProductList({
  shoppingProducts,
  products,
  productId,
  shoppingLists,
  shoppingListId,
}: {
  shoppingProducts: CompleteShoppingProduct[]
  products: Product[]
  productId?: ProductId
  shoppingLists: ShoppingList[]
  shoppingListId?: ShoppingListId
}) {
  const { optimisticShoppingProducts, addOptimisticShoppingProduct } =
    useOptimisticShoppingProducts(shoppingProducts, products, shoppingLists)
  const [open, setOpen] = useState(false)
  const [activeShoppingProduct, setActiveShoppingProduct] =
    useState<ShoppingProduct | null>(null)
  const openModal = (shoppingProduct?: ShoppingProduct) => {
    setOpen(true)
    shoppingProduct
      ? setActiveShoppingProduct(shoppingProduct)
      : setActiveShoppingProduct(null)
  }
  const closeModal = () => setOpen(false)

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={
          activeShoppingProduct ? 'Edit ShoppingProduct' : 'Create Shopping Product'
        }
      >
        <ShoppingProductForm
          shoppingProduct={activeShoppingProduct}
          addOptimistic={addOptimisticShoppingProduct}
          openModal={openModal}
          closeModal={closeModal}
          products={products}
          productId={productId}
          shoppingLists={shoppingLists}
          shoppingListId={shoppingListId}
        />
      </Modal>
      <div className='absolute right-0 top-0 '>
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticShoppingProducts.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticShoppingProducts.map((shoppingProduct) => (
            <ShoppingProduct
              shoppingProduct={shoppingProduct}
              key={shoppingProduct.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

const ShoppingProduct = ({
  shoppingProduct,
  openModal,
}: {
  shoppingProduct: CompleteShoppingProduct
  openModal: TOpenModal
}) => {
  const optimistic = shoppingProduct.id === 'optimistic'
  const deleting = shoppingProduct.id === 'delete'
  const mutating = optimistic || deleting
  const pathname = usePathname()
  const basePath = pathname.includes('shopping-products')
    ? pathname
    : pathname + '/shopping-products/'

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : ''
      )}
    >
      <div className='w-full'>
        <div>{shoppingProduct.productId}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + shoppingProduct.id}>Edit</Link>
      </Button>
    </li>
  )
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className='text-center'>
      <h3 className='mt-2 text-sm font-semibold text-secondary-foreground'>
        No shopping products
      </h3>
      <p className='mt-1 text-sm text-muted-foreground'>
        Get started by creating a new shopping product.
      </p>
      <div className='mt-6'>
        <Button onClick={() => openModal()}>
          <PlusIcon className='h-4' /> New Shopping Products{' '}
        </Button>
      </div>
    </div>
  )
}
