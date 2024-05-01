import { Suspense } from 'react'
import { headers } from 'next/headers'

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

export const revalidate = 0

type Properties = {
  searchParams: {
    page?: string
    limit?: string
  }
}

const { count } = await getTotalProductsCount()

export default async function ProductsPage({ searchParams }: Properties) {
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

        <Products currentPage={page} limit={limit} />

        <Suspense fallback={<Loading />}>
          <PaginationX page={page} limit={limit} />
        </Suspense>
      </div>
    </main>
  )
}

function PaginationX({ page, limit }: { page: number; limit: number }) {
  const totalPages = Math.ceil(count / limit)
  const previousPage = page - 1 > 0 ? page - 1 : 1
  const nextPage = page + 1
  const limitParam = (!limit || limit !== 25) && `&limit=${limit}`

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
            <PaginationPrevious href={`?page=${previousPage}${limitParam}`} />
          </PaginationItem>
        )}
        {!pageNumbers.includes(1) && (
          <div className='flex items-center gap-2'>
            <PaginationItem>
              <PaginationLink href={`?page=1${limitParam}`}>1</PaginationLink>
            </PaginationItem>
            <p className='text-md font-medium leading-none'>...</p>
          </div>
        )}
        {pageNumbers.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink isActive={page === p} href={`?page=${p}${limitParam}`}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        {!pageNumbers.includes(totalPages) && (
          <div className='flex items-center gap-2'>
            <p className='text-md font-medium leading-none'>...</p>
            <PaginationItem>
              <PaginationLink href={`?page=${totalPages}${limitParam}`}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </div>
        )}
        {page !== totalPages && (
          <PaginationItem>
            <PaginationNext href={`?page=${nextPage}${limitParam}`} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}

const Products = async ({
  currentPage,
  limit,
}: {
  currentPage: number
  limit: number
}) => {
  await checkAuth()

  const { products } = await getPaginatedProducts(currentPage, limit)
  const { supermarkets } = await getSupermarkets()
  return (
    <Suspense fallback={<Loading />}>
      <ProductList products={products} supermarkets={supermarkets} />
    </Suspense>
  )
}
