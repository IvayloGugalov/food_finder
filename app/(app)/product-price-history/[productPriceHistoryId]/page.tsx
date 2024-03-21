import { Suspense } from 'react'
import { notFound } from 'next/navigation'

import { getProductPriceHistoryById } from '@/lib/api/productPriceHistory/queries'
import { getProducts } from '@/lib/api/products/queries'
import OptimisticProductPriceHistory from './OptimisticProductPriceHistory'

import { BackButton } from '@/components/shared/BackButton'
import Loading from '@/app/loading'

export const revalidate = 0

export default async function ProductPriceHistoryPage({
  params,
}: {
  params: { productPriceHistoryId: string }
}) {
  return (
    <main className='overflow-auto'>
      <ProductPriceHistory id={params.productPriceHistoryId} />
    </main>
  )
}

const ProductPriceHistory = async ({ id }: { id: string }) => {
  const { productPriceHistory } = await getProductPriceHistoryById(id)
  const { products } = await getProducts()

  if (!productPriceHistory) notFound()
  return (
    <Suspense fallback={<Loading />}>
      <div className='relative'>
        <BackButton currentResource='product-price-history' />
        <OptimisticProductPriceHistory
          productPriceHistory={productPriceHistory}
          products={products}
        />
      </div>
    </Suspense>
  )
}
