import Image from 'next/image'

import type { Product } from '@/lib/db/schema/products'
import type { Supermarket } from '@/lib/db/schema/supermarkets'
import { AddToShoppingListButton } from './AddToShoppingListButton'
import { useAddShoppingProduct } from '@/lib/hooks/useAddShoppingProduct'
import type { CompleteProductPriceHistory } from '@/lib/db/schema/productPriceHistory'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const ProductDetails = ({
  product,
  priceHistory,
  supermarket,
}: {
  product: Product
  priceHistory: CompleteProductPriceHistory[]
  supermarket: Supermarket
}) => {
  const {
    errors,
    hasErrors,
    pending,
    handleChange,
    handleSubmitProductToShoppingList,
  } = useAddShoppingProduct()

  return (
    <div className='max-w-5xl'>
      <div className='flex gap-10'>
        <div className='ring-1 ring-inset ring-slate-300 p-10 max-h-fit'>
          <Image
            src={product.picUrl ?? '/no-image.jpg'}
            blurDataURL='/no-image.jpg'
            alt='product-image'
            placeholder='blur'
            quality={100}
            width={256}
            height={256}
            style={{
              height: '320px',
              width: '320px',
              objectFit: 'scale-down',
            }}
          />
        </div>
        <div>
          <h1 className='font-semibold text-2xl'>{product.name}</h1>
          <h2>
            Found in&nbsp;
            <a className='hover:underline' href={`/supermarkets/${supermarket.id}`}>
              {supermarket.name}
            </a>
          </h2>
          <h2>Category: {product.category}</h2>

          <div className='py-10 flex justify-between'>
            <h1 className='text-4xl'>{product.price} лв.</h1>
            <AddToShoppingListButton
              disabled={pending || hasErrors}
              onClick={() =>
                handleSubmitProductToShoppingList({
                  ...product,
                  supermarket,
                })
              }
            />
          </div>

          <Accordion type='single' collapsible>
            <AccordionItem value={product.id}>
              <AccordionTrigger>
                <h2 className='font-semibold'>Previous prices:</h2>
              </AccordionTrigger>
              <AccordionContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Week</TableHead>
                      <TableHead>Previous price</TableHead>
                      <TableHead>Selling price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {priceHistory.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className='font-medium w-[350px] '>
                          {p.weekDayStart.toDateString()} -&nbsp;
                          {p.weekDayEnd.toDateString()}
                        </TableCell>
                        {p.oldPrice && (
                          <TableCell className='font-medium'>
                            {p.oldPrice} лв.
                          </TableCell>
                        )}
                        <TableCell className='font-medium'>{p.price} лв.</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
