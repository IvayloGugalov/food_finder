import Loading from '@/app/loading'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { getShoppingProductsForShoppingListId } from '@/lib/api/shoppingProducts/queries'
import { checkAuth } from '@/lib/auth/utils'
import { CompleteShoppingList, ShoppingListId } from '@/lib/db/schema/shoppingLists'
import moment from 'moment'
import { Suspense } from 'react'
import { Product } from '../products/Product'

export default async function ShoppingListViewer({
  shoppingLists,
}: {
  shoppingLists: CompleteShoppingList[]
}) {
  return (
    <div>
      <ul>
        <Accordion type='multiple' className='w-full'>
          {shoppingLists.map((shoppingList) => (
            <AccordionItem value={shoppingList.id}>
              <AccordionTrigger>
                <div className='flex items-start gap-2'>
                  <div>From {moment(shoppingList.weekDayStart).format('D-MMM-YY')}</div>
                  <div>To {moment(shoppingList.weekDayEnd).format('D-MMM-YY')}</div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ShoppingProducts id={shoppingList.id} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ul>
    </div>
  )
}

const ShoppingProducts = async ({ id }: { id: ShoppingListId }) => {
  await checkAuth()
  const { shoppingProducts } = await getShoppingProductsForShoppingListId(id)

  return (
    <Suspense fallback={<Loading />}>
      <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {shoppingProducts.map((product) => (
          <Product key={product.id} disabled={false} product={product.product!} />
        ))}
      </ul>
    </Suspense>
  )
}
