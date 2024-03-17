'use client'

import { useOptimistic, useState } from 'react'
import { TAddOptimistic } from '@/app/(app)/product-price-history/useOptimisticProductPriceHistory'
import { type ProductPriceHistory } from '@/lib/db/schema/productPriceHistory'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import Modal from '@/components/shared/Modal'
import ProductPriceHistoryForm from '@/components/productPriceHistory/ProductPriceHistoryForm'
import { type Product, type ProductId } from '@/lib/db/schema/products'

export default function OptimisticProductPriceHistory({
  productPriceHistory,
  products,
  productId,
}: {
  productPriceHistory: ProductPriceHistory

  products: Product[]
  productId?: ProductId
}) {
  const [open, setOpen] = useState(false)
  const openModal = (_?: ProductPriceHistory) => {
    setOpen(true)
  }
  const closeModal = () => setOpen(false)
  const [optimisticProductPriceHistory, setOptimisticProductPriceHistory] =
    useOptimistic(productPriceHistory)
  const updateProductPriceHistory: TAddOptimistic = (input) =>
    setOptimisticProductPriceHistory({ ...input.data })

  return (
    <div className='m-4'>
      <Modal open={open} setOpen={setOpen}>
        <ProductPriceHistoryForm
          productPriceHistory={optimisticProductPriceHistory}
          products={products}
          productId={productId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateProductPriceHistory}
        />
      </Modal>
      <div className='flex justify-between items-end mb-4'>
        <h1 className='font-semibold text-2xl'>
          {optimisticProductPriceHistory.productId}
        </h1>
        <Button className='' onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          'bg-secondary p-4 rounded-lg break-all text-wrap',
          optimisticProductPriceHistory.id === 'optimistic' ? 'animate-pulse' : ''
        )}
      >
        {JSON.stringify(optimisticProductPriceHistory, null, 2)}
      </pre>
    </div>
  )
}
