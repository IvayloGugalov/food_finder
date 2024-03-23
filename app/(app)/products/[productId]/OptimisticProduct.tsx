'use client'

import { useOptimistic, useState } from 'react'
import { TAddOptimistic } from '@/app/(app)/products/useOptimisticProducts'
import { type Product } from '@/lib/db/schema/products'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import Modal from '@/components/shared/Modal'
import ProductForm from '@/components/products/ProductForm'
import { type Supermarket, type SupermarketId } from '@/lib/db/schema/supermarkets'
import ProductDetails from '@/components/products/ProductDetails'
import { CompleteProductPriceHistory } from '@/lib/db/schema/productPriceHistory'

export default function OptimisticProduct({
  product,
  priceHistory,
  supermarkets,
  supermarketId,
}: {
  product: Product
  priceHistory: CompleteProductPriceHistory[]
  supermarkets: Supermarket[]
  supermarketId?: SupermarketId
}) {
  const [open, setOpen] = useState(false)
  const openModal = (_?: Product) => {
    setOpen(true)
  }
  const closeModal = () => setOpen(false)
  const [optimisticProduct, setOptimisticProduct] = useOptimistic(product)
  const updateProduct: TAddOptimistic = (input) =>
    setOptimisticProduct({ ...input.data })

  const findSupermarket = () => {
    const supermarket = supermarkets.find((s) => s.id === product.supermarketId)

    if (supermarket) return supermarket
    console.debug(
      `${JSON.stringify(product)} has no matching sumermarket ${supermarketId}`
    )
    throw new Error('No matching supermarket found is not defined')
  }

  return (
    <div className='m-4'>
      <Modal open={open} setOpen={setOpen}>
        <ProductForm
          product={optimisticProduct}
          supermarkets={supermarkets}
          supermarketId={supermarketId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateProduct}
        />
      </Modal>
      <div className='py-6'>
        <ProductDetails
          product={optimisticProduct}
          priceHistory={priceHistory}
          supermarket={findSupermarket()}
        />
      </div>
      <div className='flex justify-between items-end mb-4'>
        <Button className='' onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          'bg-secondary p-4 rounded-lg break-all text-wrap',
          optimisticProduct.id === 'optimistic' ? 'animate-pulse' : ''
        )}
      >
        {JSON.stringify(optimisticProduct, null, 2)}
      </pre>
    </div>
  )
}
