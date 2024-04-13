import { createProducts } from '@/lib/api/products/mutations'
import { getSupermarkets } from '@/lib/api/supermarkets/queries'
import { NewProductParams } from '@/lib/db/schema/products'
import { Supermarket } from '@/lib/db/schema/supermarkets'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log(request.headers.get('authorization'))
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  console.log(process.env.PRODUCTS_API)

  if (!process.env.PRODUCTS_API) {
    return new Response('Missing API endpoint', {
      status: 400,
    })
  }

  const apiEndpoint = process.env.PRODUCTS_API

  try {
    const { supermarkets } = await getSupermarkets()

    console.log(supermarkets)

    const dataResponse = await fetch(apiEndpoint)
    const data = (await dataResponse.json()) as {
      supermarket: string
      updatedAt: Date
      products: NewProductParams[]
    }[]

    const products = data
      .map((x) =>
        x.products.map((p) => ({
          ...p,
          name:
            p.name.length > 256 ? p.name.split(/\s+/).slice(0, 10).join(' ') : p.name,
          price: p.price ? parseFloat(`${p.price}`.replace(/,/, '.')) : 0,
          oldPrice: p.oldPrice
            ? parseFloat(`${p.oldPrice}`.replace(/,/, '.'))
            : p.oldPrice,
          supermarketId: mapIdByName(x.supermarket, supermarkets) ?? 'ivoG',
        }))
      )
      .flat()

    console.log('products: ', products.length)

    await createProducts(products)

    return new NextResponse('Success', {
      status: 200,
    })
  } catch (exception) {
    console.error(JSON.stringify(exception))

    return new Response('Unable to add products', {
      status: 400,
    })
  }
}

const mapIdByName = (name: string, supermarkets: Supermarket[]) => {
  const lowerCaseName = name.toLowerCase()
  const matchedObject = supermarkets.find(
    (object) => object.name.toLowerCase() === lowerCaseName
  )
  return matchedObject ? matchedObject.id : null
}