'use client'
import { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { CompleteProduct } from '@/lib/db/schema/products'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { AddToShoppingListButton } from './AddToShoppingListButton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const currentDate = new Date()

export const ProductCard = ({
  product,
  handleSubmit,
  disabled,
}: {
  product: CompleteProduct
  handleSubmit: (payload: CompleteProduct) => void
  disabled: boolean
}) => {
  const router = useRouter()

  const calculatePromotionDays = useMemo(() => {
    if (!product.validUntil) return 0
    // TODO: Use UTC time, create caching mechanism
    const days = Math.ceil(
      (new Date(product.validUntil).getTime() - currentDate.getTime()) /
        (1000 * 60 * 60 * 24)
    )
    return days
  }, [product.validUntil])

  return (
    <Card
      className={cn('flex flex-col justify-start h-full rounded-lg overflow-hidden')}
    >
      <div className='relative bg-white'>
        <Link href={`/products/${product.id}`}>
          <Image
            src={product.picUrl ?? '/no-image.jpg'}
            blurDataURL='/no-image.jpg'
            alt='product-image'
            placeholder='blur'
            quality={100}
            width={256}
            height={256}
            className='h-64 w-full object-scale-down rounded-lg'
          />
        </Link>
        <div className='absolute top-2 right-2 rounded-full bg-secondary px-3 py-[0.375rem]'>
          <p className='text-xs font-medium leading-none'>
            {product.validUntil && `Ends in ${calculatePromotionDays} days`} in{' '}
            {product.supermarket?.name}
          </p>
        </div>
      </div>

      <CardHeader className='p-4 text-center lg:text-left max-w-[310px]'>
        <CardTitle className='text-xl'>
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger className='max-w-full truncate'>
                {product.name}
              </TooltipTrigger>
              <TooltipContent align='start' alignOffset={-4} sideOffset={6}>
                {product.name}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>

        <CardDescription className='truncate'>{product.category}</CardDescription>
      </CardHeader>

      <CardFooter className='flex flex-col items-center gap-2 py-[0.75rem] px-4 border-t-[1px]'>
        <div className='flex w-full items-center gap-2 py-1'>
          {product.oldPrice && (
            <p className='text-sm line-through font-light text-slate-400'>
              {product.oldPrice} лв.
            </p>
          )}
          <p className='text-lg font-medium leading-none'>{product.price} лв.</p>

          <div className='ml-auto'>
            <Image
              src={`/${product.supermarket?.name}.svg`}
              blurDataURL='/no-image.jpg'
              alt='product-image'
              placeholder='blur'
              quality={70}
              width={35}
              height={35}
              className='h-10 w-full object-scale-down rounded-lg'
            />
          </div>
        </div>

        <AddToShoppingListButton
          onClick={() => handleSubmit(product)}
          disabled={disabled}
        />
      </CardFooter>
    </Card>
  )
}
