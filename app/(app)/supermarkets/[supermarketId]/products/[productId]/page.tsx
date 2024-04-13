import { Suspense } from 'react'
import { notFound } from 'next/navigation'

import { getProductById } from '@/lib/api/products/queries'
import { getSupermarkets } from '@/lib/api/supermarkets/queries'
import OptimisticProduct from '@/app/(app)/products/[productId]/OptimisticProduct'
import { checkAuth } from '@/lib/auth/utils'

import { BackButton } from '@/components/shared/BackButton'
import Loading from '@/app/loading'

export const revalidate = 0

export default async function ProductPage({
  params,
}: {
  params: { productId: string }
}) {
  return (
    <main className='overflow-auto'>
      <Product id={params.productId} />
    </main>
  )
}

const Product = async ({ id }: { id: string }) => {
  await checkAuth()

  const { product } = await getProductById(id)
  const { supermarkets } = await getSupermarkets()

  if (!product) notFound()
  return (
    <Suspense fallback={<Loading />}>
      <div className='relative'>
        <BackButton currentResource='products' />
        Render product here?
        {/* <OptimisticProduct
          product={product}
          supermarkets={supermarkets}
          supermarketId={product.supermarketId}
          priceHistory={null}
        /> */}
      </div>
    </Suspense>
  )
}
