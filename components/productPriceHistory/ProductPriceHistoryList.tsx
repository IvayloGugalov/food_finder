'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import {
  type ProductPriceHistory,
  CompleteProductPriceHistory,
} from '@/lib/db/schema/productPriceHistory'
import Modal from '@/components/shared/Modal'
import { type Product, type ProductId } from '@/lib/db/schema/products'
import { useOptimisticProductPriceHistories } from '@/app/(app)/product-price-history/useOptimisticProductPriceHistory'
import { Button } from '@/components/ui/button'
import ProductPriceHistoryForm from './ProductPriceHistoryForm'
import { PlusIcon } from 'lucide-react'

type TOpenModal = (productPriceHistory?: ProductPriceHistory) => void

export default function ProductPriceHistoryList({
  productPriceHistory,
  products,
  productId,
}: {
  productPriceHistory: CompleteProductPriceHistory[]
  products: Product[]
  productId?: ProductId
}) {
  const { optimisticProductPriceHistories, addOptimisticProductPriceHistory } =
    useOptimisticProductPriceHistories(productPriceHistory, products)
  const [open, setOpen] = useState(false)
  const [activeProductPriceHistory, setActiveProductPriceHistory] =
    useState<ProductPriceHistory | null>(null)
  const openModal = (productPriceHistory?: ProductPriceHistory) => {
    setOpen(true)
    productPriceHistory
      ? setActiveProductPriceHistory(productPriceHistory)
      : setActiveProductPriceHistory(null)
  }
  const closeModal = () => setOpen(false)

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={
          activeProductPriceHistory
            ? 'Edit ProductPriceHistory'
            : 'Create Product Price History'
        }
      >
        <ProductPriceHistoryForm
          productPriceHistory={activeProductPriceHistory}
          addOptimistic={addOptimisticProductPriceHistory}
          openModal={openModal}
          closeModal={closeModal}
          products={products}
          productId={productId}
        />
      </Modal>
      <div className='absolute right-0 top-0 '>
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticProductPriceHistories.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticProductPriceHistories.map((productPriceHistory) => (
            <ProductPriceHistory
              productPriceHistory={productPriceHistory}
              key={productPriceHistory.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

const ProductPriceHistory = ({
  productPriceHistory,
  openModal,
}: {
  productPriceHistory: CompleteProductPriceHistory
  openModal: TOpenModal
}) => {
  const optimistic = productPriceHistory.id === 'optimistic'
  const deleting = productPriceHistory.id === 'delete'
  const mutating = optimistic || deleting
  const pathname = usePathname()
  const basePath = pathname.includes('product-price-history')
    ? pathname
    : pathname + '/product-price-history/'

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : ''
      )}
    >
      <div className='w-full'>
        <div>{productPriceHistory.productId}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + productPriceHistory.id}>Edit</Link>
      </Button>
    </li>
  )
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className='text-center'>
      <h3 className='mt-2 text-sm font-semibold text-secondary-foreground'>
        No product price history
      </h3>
      <p className='mt-1 text-sm text-muted-foreground'>
        Get started by creating a new product price history.
      </p>
      <div className='mt-6'>
        <Button onClick={() => openModal()}>
          <PlusIcon className='h-4' /> New Product Price History{' '}
        </Button>
      </div>
    </div>
  )
}
