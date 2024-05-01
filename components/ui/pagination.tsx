import * as React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import type { ButtonProperties} from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button'

const Pagination = ({ className, ...properties }: React.ComponentProps<'nav'>) => (
  <nav
    role='navigation'
    aria-label='pagination'
    className={cn('mx-auto flex w-full justify-center', className)}
    {...properties}
  />
)
Pagination.displayName = 'Pagination'

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...properties }, reference) => (
  <ul
    ref={reference}
    className={cn('flex flex-row items-center gap-1', className)}
    {...properties}
  />
))
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
  ({ className, ...properties }, reference) => (
    <li ref={reference} className={cn('', className)} {...properties} />
  )
)
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProperties = {
  isActive?: boolean
} & Pick<ButtonProperties, 'size'> &
  React.ComponentProps<typeof Link>

const PaginationLink = ({
  className,
  isActive,
  size = 'icon',
  ...properties
}: PaginationLinkProperties) => (
  <PaginationItem>
    <Link
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? 'outline' : 'ghost',
          size,
        }),
        'w-8 h-8',
        isActive && 'bg-accent text-accent-foreground brightness-[.92]',
        className
      )}
      {...properties}
    />
  </PaginationItem>
)
PaginationLink.displayName = 'PaginationLink'

const PaginationPrevious = ({
  className,
  ...properties
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label='Go to previous page' className={cn(className)} {...properties}>
    <ChevronLeft className='h-4 w-4' />
  </PaginationLink>
)
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({
  className,
  ...properties
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label='Go to next page' className={cn(className)} {...properties}>
    <ChevronRight className='h-4 w-4' />
  </PaginationLink>
)
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = ({ className, ...properties }: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...properties}
  >
    <MoreHorizontal className='h-4 w-4' />
    <span className='sr-only'>More pages</span>
  </span>
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
