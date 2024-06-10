import {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import type { SupermarketId } from '@/lib/db/schema/supermarkets'

export function ProductsPagination({
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
          <PaginationPrevious
            href={`${supermarketParameter}&page=${previousPage}${limitParameter}`}
          />
        )}
        {!pageNumbers.includes(1) && (
          <div className='flex items-center gap-2'>
            <PaginationLink href={`${supermarketParameter}&page=1${limitParameter}`}>
              1
            </PaginationLink>
            <p className='text-md font-medium leading-none'>...</p>
          </div>
        )}
        {pageNumbers.map((p) => (
          <PaginationLink
            key={p}
            isActive={page === p}
            href={`${supermarketParameter}&page=${p}${limitParameter}`}
          >
            {p}
          </PaginationLink>
        ))}
        {!pageNumbers.includes(totalPages) && (
          <div className='flex items-center gap-2'>
            <p className='text-md font-medium leading-none'>...</p>
            <PaginationLink
              href={`${supermarketParameter}&page=${totalPages}${limitParameter}`}
            >
              {totalPages}
            </PaginationLink>
          </div>
        )}
        {page !== totalPages && (
          <PaginationNext
            href={`${supermarketParameter}&page=${nextPage}${limitParameter}`}
          />
        )}
      </PaginationContent>
    </Pagination>
  )
}
