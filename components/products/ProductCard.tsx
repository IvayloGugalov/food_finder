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
} from '@/components/ui/card'
import { AddToShoppingListButton } from './AddToShoppingListButton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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
    <Card className={cn('flex flex-col justify-start h-full')}>
      <div
        className='rounded-t-lg hover:ring-1 ring-inset ring-slate-400 cursor-pointer'
        onClick={() => router.push(`/products/${product.id}`)}
      >
        <CardContent className='pt-6 relative'>
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
          <CardTitle className='text-xl'>
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger className='max-w-full truncate'>
                  {product.name}
                </TooltipTrigger>
                <TooltipContent align='start'>{product.name}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription className='truncate'>{product.category}</CardDescription>
        </CardHeader>
      </div>
      <CardFooter className='flex justify-between items-center gap-2 py-[0.75rem] border-t-[1px]'>
        <div>
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
