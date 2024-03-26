// 'use client'
// import { Button } from '@/components/ui/button'

import data from '1st.json'
import newerdata from '2nd.json'

import {
  SupermarketId,
  NewSupermarketParams,
  UpdateSupermarketParams,
  supermarketIdSchema,
  insertSupermarketParams,
  updateSupermarketParams,
} from '@/lib/db/schema/supermarkets'
import {
  ProductId,
  NewProductParams,
  UpdateProductParams,
  productIdSchema,
  insertProductParams,
  updateProductParams,
} from '@/lib/db/schema/products'
import { createSupermarket } from '@/lib/api/supermarkets/mutations'
import { useTransition } from 'react'
import { createProduct, createProducts } from '@/lib/api/products/mutations'

// const fetchUrl = 'https://sofia-supermarkets-api-proxy.stefan-bratanov.workers.dev/products'

const ddd = [
  { id: 'ouh11dqxk9xjmrhzn8v4s', name: 'Lidl' },
  { id: '5rvif4y3b4u3by78b1837', name: 'Billa' },
  { id: 'zun7p06i1uu4cu6x3joy1', name: 'Kaufland' },
  { id: 'wxm18uuk524j3gl5vvl8n', name: 'T-Market' },
  { id: 'o7v3p397v1rq97iju91ee', name: 'Fantastico' },
]

const mapIdByName = (name: string, supermarkets: typeof ddd) => {
  const lowerCaseName = name.toLowerCase()
  const matchedObject = supermarkets.find(
    (obj) => obj.name.toLowerCase() === lowerCaseName
  )
  return matchedObject ? matchedObject.id : null
}

export default async function GenerateAllPage() {
  const fetchData = async () => {
    // const data = data
    // const response = await fetch(fetchUrl)
    // const json = (await response.json()) as {
    //   supermarket: string
    //   updatedAt: Date
    //   products: NewProductParams[]
    // }[]

    // const superMarkets = newerdata.map((x) => x.supermarket)
    // const products = newerdata
    //   .map((x) =>
    //     x.products.map((p) => ({
    //       ...p,
    //       price: p.price ? parseFloat(`${p.price}`.replace(/,/, '.')) : 0,
    //       oldPrice: p.oldPrice ? parseFloat(`${p.oldPrice}`.replace(/,/, '.')) : p.oldPrice,
    //       supermarketId: mapIdByName(x.supermarket, ddd) ?? 'ivoG',
    //     }))
    //   )
    //   .flat()

    // const creatingsuperMarkets = superMarkets.map((spmr) => {
    //   createSupermarket({name: spmr })
    // })
    // await Promise.all(creatingsuperMarkets)
    await createProduct({
      category: 'НИСКА цена, ВИСОКО качество',
      name: 'АМЕТА Прясно цяло пиле',
      oldPrice: 5,
      picUrl: null,
      price: 9.99,
      quantity: 'за kg',
      supermarketId: 'ouh11dqxk9xjmrhzn8v4s',
      validFrom: '2024-03-11',
      validUntil: '2024-03-11',
    })
    // console.log(products.length)
    try {
      // await createProducts(products)
    } catch (e) {
      console.error(JSON.stringify(e))
    }
    // const creatingProducts = products.map((product) => {
    //   // console.log(product.name)
    //   try {
    //     createProduct(product as unknown as NewProductParams)
    //   } catch (e) {}
    // })
    // await Promise.all(creatingProducts)
  }

  // await fetchData()

  return (
    <main>
      <div className='relative'>
        <div className='flex justify-between'>
          <h1 className='font-semibold text-2xl my-2'>Generate all data</h1>
        </div>
        <div>
          {/* <button
            // variant={'secondary'}
            className='w-fit h-fit'
            onClick={() => fetchData()}
          >
            Update all
          </button> */}
        </div>
      </div>
    </main>
  )
}
