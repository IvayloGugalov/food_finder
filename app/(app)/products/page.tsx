import { Suspense } from 'react'

import Loading from '@/app/loading'
import ProductList from '@/components/products/ProductList'
import { getPaginatedProducts, getTotalProductsCount } from '@/lib/api/products/queries'
import { getSupermarkets } from '@/lib/api/supermarkets/queries'
import { checkAuth } from '@/lib/auth/utils'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
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
          <PaginationX
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

function PaginationX({
  page,
  limit,
  productsCount,
  supermarketId,
}: {
  page: number
  limit: number
  productsCount: number
  supermarketId?: SupermarketId
}) {
  const totalPages = Math.ceil(productsCount / limit)
  const previousPage = page - 1 > 0 ? page - 1 : 1
  const nextPage = page + 1
  const limitParameter = (!limit || limit !== 25) && `&limit=${limit}`
  const supermarketParameter = supermarketId && `?supermarket=${supermarketId}`

  const pageNumbers = []
  for (let index = page - 3; index <= page + 3; index++) {
    if (index >= 1 && index <= totalPages) {
      pageNumbers.push(index)
    }
  }

  return (
    <Pagination className='m-0 mt-10 border-[1px] p-2 rounded-lg'>
      <PaginationContent>
        {page !== 1 && (
          <PaginationItem>
            <PaginationPrevious
              href={`${supermarketParameter}&page=${previousPage}${limitParameter}`}
            />
          </PaginationItem>
        )}
        {!pageNumbers.includes(1) && (
          <div className='flex items-center gap-2'>
            <PaginationItem>
              <PaginationLink href={`${supermarketParameter}&page=1${limitParameter}`}>
                1
              </PaginationLink>
            </PaginationItem>
            <p className='text-md font-medium leading-none'>...</p>
          </div>
        )}
        {pageNumbers.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              isActive={page === p}
              href={`${supermarketParameter}&page=${p}${limitParameter}`}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        {!pageNumbers.includes(totalPages) && (
          <div className='flex items-center gap-2'>
            <p className='text-md font-medium leading-none'>...</p>
            <PaginationItem>
              <PaginationLink
                href={`${supermarketParameter}&page=${totalPages}${limitParameter}`}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </div>
        )}
        {page !== totalPages && (
          <PaginationItem>
            <PaginationNext
              href={`${supermarketParameter}&page=${nextPage}${limitParameter}`}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
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
