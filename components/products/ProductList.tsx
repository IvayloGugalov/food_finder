'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

import { cn } from '@/lib/utils'
import { type Product, CompleteProduct } from '@/lib/db/schema/products'
import Modal from '@/components/shared/Modal'
import { type Supermarket, type SupermarketId } from '@/lib/db/schema/supermarkets'
import { useOptimisticProducts } from '@/app/(app)/products/useOptimisticProducts'
import { Button } from '@/components/ui/button'
import ProductForm from './ProductForm'
import { BellRing, Check, PlusIcon } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card'

type TOpenModal = (product?: Product) => void

export default function ProductList({
  products,
  supermarkets,
  supermarketId,
}: {
  products: CompleteProduct[]
  supermarkets: Supermarket[]
  supermarketId?: SupermarketId
}) {
  const { optimisticProducts, addOptimisticProduct } = useOptimisticProducts(products, supermarkets)
  const [open, setOpen] = useState(false)
  const [activeProduct, setActiveProduct] = useState<Product | null>(null)
  const openModal = (product?: Product) => {
    setOpen(true)
    product ? setActiveProduct(product) : setActiveProduct(null)
  }
  const closeModal = () => setOpen(false)

  return (
    <div>
      {/* <Modal
        open={open}
        setOpen={setOpen}
        title={activeProduct ? 'Edit Product' : 'Create Product'}
      >
        <ProductForm
          product={activeProduct}
          addOptimistic={addOptimisticProduct}
          openModal={openModal}
          closeModal={closeModal}
          supermarkets={supermarkets}
          supermarketId={supermarketId}
        />
      </Modal> */}
      <div className='absolute right-0 top-0 '>
        <Button
          onClick={() => openModal()}
          variant={'outline'}
        >
          +
        </Button>
      </div>
      {optimisticProducts.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul className='grid gap-4 grid-cols-4'>
          {optimisticProducts.map((product) => (
            <Product
              product={product}
              key={product.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

const Product = ({ product, openModal }: { product: CompleteProduct; openModal: TOpenModal }) => {
  const optimistic = product.id === 'optimistic'
  const deleting = product.id === 'delete'
  const mutating = optimistic || deleting
  const pathname = usePathname()
  const basePath = pathname.includes('products') ? pathname : pathname + '/products/'

  return (
    <>
      <Card className={cn('w-[380px] flex flex-col justify-between')}>
        <CardContent className='pt-4'>
          {/* <div className=' flex items-center space-x-4 rounded-md border p-4'>
            <BellRing />
            <div className='flex-1 space-y-1'>
              <p className='text-sm font-medium leading-none'>Push Notifications</p>
              <p className='text-sm text-muted-foreground'>Send notifications to device.</p>
            </div>
            <Switch />
          </div> */}
          <div className='flex justify-center'>
            {product.picUrl && (
              <Image
                src={product.picUrl}
                alt='product-image'
                width={150}
                height={150}
                objectFit='contain'
                style={{
                  width: 'auto',
                  height: 'auto',
                }}
              />
            )}
            {/* {notifications.map((notification, index) => (
              <div
                key={index}
                className='mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0'
              >
                <span className='flex h-2 w-2 translate-y-1 rounded-full bg-sky-500' />
                <div className='space-y-1'>
                  <p className='text-sm font-medium leading-none'>{notification.title}</p>
                  <p className='text-sm text-muted-foreground'>{notification.description}</p>
                </div>
              </div>
            ))} */}
          </div>
        </CardContent>
        <CardHeader className='pt-0 pb-4'>
          <CardTitle>{product.name}</CardTitle>
          <CardDescription>{product.category}</CardDescription>
        </CardHeader>
        <CardFooter className='justify-between space-x-2'>
          <div className='flex flex-col gap-1'>
            <p className='text-lg font-medium leading-none'>{product.price} лв.</p>
            {product.oldPrice && <p className='text-sm font-light text-slate-400'>{product.oldPrice} лв.</p>}
          </div>
          <Button>Add to basket</Button>
        </CardFooter>
      </Card>

      {/* <li
        className={cn(
          'flex justify-between my-2',
          mutating ? 'opacity-30 animate-pulse' : '',
          deleting ? 'text-destructive' : ''
        )}
      >
        <div className='w-full'>
          <div>{product.name}</div>
        </div>
        <Button
          variant={'link'}
          asChild
        >
          <Link href={basePath + '/' + product.id}>Edit</Link>
        </Button>
      </li> */}
    </>
  )
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className='text-center'>
      <h3 className='mt-2 text-sm font-semibold text-secondary-foreground'>No products</h3>
      <p className='mt-1 text-sm text-muted-foreground'>Get started by creating a new product.</p>
      <div className='mt-6'>
        <Button onClick={() => openModal()}>
          <PlusIcon className='h-4' /> New Products{' '}
        </Button>
      </div>
    </div>
  )
}
