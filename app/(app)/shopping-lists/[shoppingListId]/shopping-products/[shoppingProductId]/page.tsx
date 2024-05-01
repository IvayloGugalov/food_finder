import { Suspense } from 'react'
import { notFound } from 'next/navigation'

import { getShoppingProductById } from '@/lib/api/shoppingProducts/queries'
import { getAllProducts } from '@/lib/api/products/queries'
import { getShoppingLists } from '@/lib/api/shoppingLists/queries'
import OptimisticShoppingProduct from '@/app/(app)/shopping-products/[shoppingProductId]/OptimisticShoppingProduct'

import { BackButton } from '@/components/shared/BackButton'
import Loading from '@/app/loading'

export const revalidate = 0

export default async function ShoppingProductPage({
  params,
}: {
  params: { shoppingProductId: string }
}) {
  return (
    <main className='overflow-auto'>
      <ShoppingProduct id={params.shoppingProductId} />
    </main>
  )
}

const ShoppingProduct = async ({ id }: { id: string }) => {
  const { shoppingProduct } = await getShoppingProductById(id)
  const { products } = await getAllProducts()
  const { shoppingLists } = await getShoppingLists()

  if (!shoppingProduct) notFound()
  return (
    <Suspense fallback={<Loading />}>
      <div className='relative'>
        <BackButton currentResource='shopping-products' />
        <OptimisticShoppingProduct
          shoppingProduct={shoppingProduct}
          products={products}
          productId={shoppingProduct.productId}
          shoppingLists={shoppingLists}
          shoppingListId={shoppingProduct.shoppingListId}
        />
      </div>
    </Suspense>
  )
}
