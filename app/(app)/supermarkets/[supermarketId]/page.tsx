import { Suspense } from 'react'
import { notFound } from 'next/navigation'

import { getSupermarketByIdWithProducts } from '@/lib/api/supermarkets/queries'
import OptimisticSupermarket from './OptimisticSupermarket'
import { checkAuth } from '@/lib/auth/utils'
import ProductList from '@/components/products/ProductList'

import { BackButton } from '@/components/shared/BackButton'
import Loading from '@/app/loading'

export const revalidate = 0

export default async function SupermarketPage({
  params,
}: {
  params: { supermarketId: string }
}) {
  return (
    <main className='overflow-auto'>
      <Supermarket id={params.supermarketId} />
    </main>
  )
}

const Supermarket = async ({ id }: { id: string }) => {
  await checkAuth()

  const { supermarket, products } = await getSupermarketByIdWithProducts(id)

  if (!supermarket) notFound()
  return (
    <Suspense fallback={<Loading />}>
      <div className='relative'>
        <BackButton currentResource='supermarkets' />
        <OptimisticSupermarket supermarket={supermarket} />
      </div>
      <div className='relative mt-8 mx-4'>
        <h3 className='text-xl font-medium mb-4'>{supermarket.name}&apos;s Products</h3>
        <ProductList supermarkets={[]} products={products} />
      </div>
    </Suspense>
  )
}
