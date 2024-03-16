import { Suspense } from 'react'
import { notFound } from 'next/navigation'

import { getShoppingListByIdWithShoppingProducts } from '@/lib/api/shoppingLists/queries'
import OptimisticShoppingList from './OptimisticShoppingList'
import { checkAuth } from '@/lib/auth/utils'
import ShoppingProductList from '@/components/shoppingProducts/ShoppingProductList'

import { BackButton } from '@/components/shared/BackButton'
import Loading from '@/app/loading'

export const revalidate = 0

export default async function ShoppingListPage({ params }: { params: { shoppingListId: string } }) {
  return (
    <main className='overflow-auto'>
      <ShoppingList id={params.shoppingListId} />
    </main>
  )
}

const ShoppingList = async ({ id }: { id: string }) => {
  await checkAuth()

  const { shoppingList, shoppingProducts } = await getShoppingListByIdWithShoppingProducts(id)

  if (!shoppingList) notFound()
  return (
    <Suspense fallback={<Loading />}>
      <div className='relative'>
        <BackButton currentResource='shopping-lists' />
        <OptimisticShoppingList shoppingList={shoppingList} />
      </div>
      <div className='relative mt-8 mx-4'>
        <h3 className='text-xl font-medium mb-4'>
          {shoppingList.description}&apos;s Shopping Products
        </h3>
        <ShoppingProductList
          products={[]}
          shoppingLists={[]}
          shoppingListId={shoppingList.id}
          shoppingProducts={shoppingProducts}
        />
      </div>
    </Suspense>
  )
}
