import { Suspense } from 'react'

import Loading from '@/app/loading'
import ShoppingProductList from '@/components/shoppingProducts/ShoppingProductList'
import { getShoppingProducts } from '@/lib/api/shoppingProducts/queries'
import { getProducts } from '@/lib/api/products/queries'
import { getShoppingLists } from '@/lib/api/shoppingLists/queries'

export const revalidate = 0

export default async function ShoppingProductsPage() {
  return (
    <main>
      <div className='relative'>
        <div className='flex justify-between'>
          <h1 className='font-semibold text-2xl my-2'>Shopping Products</h1>
        </div>
        <ShoppingProducts />
      </div>
    </main>
  )
}

const ShoppingProducts = async () => {
  const { shoppingProducts } = await getShoppingProducts()
  const { products } = await getProducts()
  const { shoppingLists } = await getShoppingLists()
  return (
    <Suspense fallback={<Loading />}>
      <ShoppingProductList
        shoppingProducts={shoppingProducts}
        products={products}
        shoppingLists={shoppingLists}
      />
    </Suspense>
  )
}
