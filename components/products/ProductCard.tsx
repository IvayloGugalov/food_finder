'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { CompleteProduct } from '@/lib/db/schema/products'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../ui/card'
import { AddToShoppingListButton } from './AddToShoppingListButton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

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

  return (
    <Card className={cn('flex flex-col justify-between')}>
      <div
        className='hover:ring-1 ring-inset ring-slate-400 cursor-pointer'
        onClick={() => router.push(`/products/${product.id}`)}
      >
        <CardContent className='pt-4 relative'>
          <div className='absolute top-2 right-2'>
            <p className='text-sm font-medium leading-none text-slate-400'>
              {product.validUntil && `until ${product.validUntil}`} in{' '}
              {product.supermarket?.name}
            </p>
          </div>
          <div className='flex justify-center'>
            <Image
              src={product.picUrl ?? '/no-image.jpg'}
              blurDataURL='/no-image.jpg'
              alt='product-image'
              placeholder='blur'
              quality={100}
              width={256}
              height={256}
              style={{
                height: '256px',
                width: '256px',
                objectFit: 'scale-down',
              }}
            />
          </div>
        </CardContent>
        <CardHeader className='pt-0 pl-4 pb-4 text-center lg:text-left max-w-[310px]'>
          <CardTitle className='text-xl truncate text-ellipsis overflow-hidden text-nowrap'>
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger>{product.name}</TooltipTrigger>
                {product.name.length >= 24 && (
                  <TooltipContent align='start'>{product.name}</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>{product.category}</CardDescription>
        </CardHeader>
      </div>
      <CardFooter className='py-[0.75rem] lg:px-4 border-t-[1px] flex-row justify-between space-x-2'>
        <div className='flex flex-col gap-1'>
          <p className='text-lg font-medium leading-none'>{product.price} лв.</p>
          {product.oldPrice && (
            <p className='text-sm font-light text-slate-400'>{product.oldPrice} лв.</p>
          )}
        </div>
        <AddToShoppingListButton
          onClick={() => handleSubmit(product)}
          disabled={disabled}
        />
      </CardFooter>
    </Card>
  )
}
