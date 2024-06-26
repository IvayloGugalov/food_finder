import { Suspense } from 'react'

import Loading from '@/app/loading'
import ProductPriceHistoryList from '@/components/productPriceHistory/ProductPriceHistoryList'
import { getAllProductPriceHistories } from '@/lib/api/productPriceHistory/queries'
import { getAllProducts } from '@/lib/api/products/queries'

export const revalidate = 0

export default async function ProductPriceHistoryPage() {
  return (
    <main>
      <div className='relative'>
        <div className='flex justify-between'>
          <h1 className='font-semibold text-2xl my-2'>Product Price History</h1>
        </div>
        <ProductPriceHistory />
      </div>
    </main>
  )
}

const ProductPriceHistory = async () => {
  const { productPriceHistory } = await getAllProductPriceHistories()
  const { products } = await getAllProducts()
  return (
    <Suspense fallback={<Loading />}>
      <ProductPriceHistoryList
        productPriceHistory={productPriceHistory}
        products={products}
      />
    </Suspense>
  )
}
