import { createProduct } from '@/lib/api/products/mutations'
import { getSupermarkets } from '@/lib/api/supermarkets/queries'
import type { NewProductParams } from '@/lib/db/schema/products'
import type { Supermarket } from '@/lib/db/schema/supermarkets'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

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
      .flatMap((x) =>
        x.products.map((p) => ({
          ...p,
          name:
            p.name.length > 256 ? p.name.split(/\s+/).slice(0, 10).join(' ') : p.name,
          price: p.price ? Number.parseFloat(`${p.price}`.replace(/,/, '.')) : 0,
          oldPrice:
            p.oldPrice ?
              Number.parseFloat(`${p.oldPrice}`.replace(/,/, '.'))
            : p.oldPrice,
          supermarketId: mapIdByName(x.supermarket, supermarkets) ?? 'ivoG',
        }))
      )
      .filter((p) => !!p.price)

    console.log('products:', products.length)

    for (const product of products) {
      try {
        await createProduct(product)
        await new Promise((resolve) => setTimeout(resolve, 500))
      } catch (error) {
        console.error('🚨 Error creating product:', error)
      }
    }

    // const promises = products.map(async (product) => await createProduct(product))
    // console.log(promises)
    // const results = await Promise.all(promises)
    // console.log(results)

    return new NextResponse('Success', {
      status: 200,
    })
  } catch (error) {
    console.error(JSON.stringify(error))

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
