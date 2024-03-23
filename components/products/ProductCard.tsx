'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { CompleteProduct } from '@/lib/db/schema/products'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../ui/card'
import { SaveButton } from './SaveButton'

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
        <CardContent className='pt-4'>
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
        <CardHeader className='pt-0 pb-4 text-center lg:text-left'>
          <CardTitle>{product.name}</CardTitle>
          <CardDescription>{product.category}</CardDescription>
        </CardHeader>
      </div>
      <CardFooter className='py-[0.75rem] lg:px-6 px-2 border-t-[1px] flex-row justify-between space-x-2'>
        <div className='flex flex-col gap-1'>
          <p className='text-lg font-medium leading-none'>{product.price} лв.</p>
          {product.oldPrice && (
            <p className='text-sm font-light text-slate-400'>{product.oldPrice} лв.</p>
          )}
        </div>
        <SaveButton onClick={() => handleSubmit(product)} disabled={disabled} />
      </CardFooter>
    </Card>
  )
}
