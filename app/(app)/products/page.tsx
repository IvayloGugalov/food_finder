import { Suspense } from 'react'

import Loading from '@/app/loading'
import ProductList from '@/components/products/ProductList'
import { getPaginatedProducts, getTotalProductsCount } from '@/lib/api/products/queries'
import { getSupermarkets } from '@/lib/api/supermarkets/queries'
import { checkAuth } from '@/lib/auth/utils'
import { ProductsPagination } from '@/components/products/ProductsPagination'
import type { SupermarketId } from '@/lib/db/schema/supermarkets'

export const revalidate = 0

type Properties = {
  searchParams: {
    page?: string
    limit?: string
    supermarket?: string
  }
}

export default async function ProductsPage({ searchParams }: Properties) {
  const { count: productsCount } = await getTotalProductsCount(searchParams.supermarket)
  let page = Number.parseInt(searchParams.page ?? '1', 10)
  page = !page || page < 1 ? 1 : page
  let limit = Number.parseInt(searchParams.limit ?? '25', 10)
  limit = !limit || limit < 25 ? 25 : limit

  return (
    <main>
      <div className='relative'>
        <div className='flex justify-between'>
          <h1 className='font-semibold text-2xl my-2'>Products</h1>
        </div>

        <Products
          currentPage={page}
          limit={limit}
          supermarketId={searchParams.supermarket}
        />

        <Suspense fallback={<Loading />}>
          <ProductsPagination
            page={page}
            limit={limit}
            productsCount={productsCount}
            supermarketId={searchParams.supermarket}
          />
        </Suspense>
      </div>
    </main>
  )
}

const Products = async ({
  currentPage,
  limit,
  supermarketId,
}: {
  currentPage: number
  limit: number
  supermarketId?: SupermarketId
}) => {
  await checkAuth()

  const { products } = await getPaginatedProducts(currentPage, limit, supermarketId)
  const { supermarkets } = await getSupermarkets()

  return (
    <Suspense fallback={<Loading />}>
      <ProductList products={products} supermarkets={supermarkets} />
    </Suspense>
  )
}
