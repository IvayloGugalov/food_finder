'use client'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { Product as ProductType } from '@/lib/db/schema/products'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../ui/card'
import { AddToShoppingListButton } from './AddToShoppingListButton'

export const Product = ({
  product,
  handleSubmit,
  disabled,
}: {
  product: ProductType
  handleSubmit?: (payload: ProductType) => void
  disabled: boolean
}) => (
  <Card className={cn('flex flex-col justify-between')}>
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
    <CardFooter className='py-[0.75rem] lg:px-6 px-2 border-t-[1px] flex-row justify-between space-x-2'>
      <div className='flex flex-col gap-1'>
        <p className='text-lg font-medium leading-none'>{product.price} лв.</p>
        {product.oldPrice && (
          <p className='text-sm font-light text-slate-400'>{product.oldPrice} лв.</p>
        )}
      </div>
      {handleSubmit && (
        <AddToShoppingListButton onClick={() => handleSubmit(product)} disabled={disabled} />
      )}
    </CardFooter>
  </Card>
)
