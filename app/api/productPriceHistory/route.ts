import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import {
  createProductPriceHistory,
  deleteProductPriceHistory,
  updateProductPriceHistory,
} from '@/lib/api/productPriceHistory/mutations'
import {
  productPriceHistoryIdSchema,
  insertProductPriceHistoryParams,
  updateProductPriceHistoryParams,
} from '@/lib/db/schema/productPriceHistory'

export async function POST(req: Request) {
  try {
    const validatedData = insertProductPriceHistoryParams.parse(await req.json())
    const { productPriceHistory } = await createProductPriceHistory(validatedData)

    revalidatePath('/productPriceHistory') // optional - assumes you will have named route same as entity

    return NextResponse.json(productPriceHistory, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    } else {
      return NextResponse.json({ error: err }, { status: 500 })
    }
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    const validatedData = updateProductPriceHistoryParams.parse(await req.json())
    const validatedParams = productPriceHistoryIdSchema.parse({ id })

    const { productPriceHistory } = await updateProductPriceHistory(
      validatedParams.id,
      validatedData
    )

    return NextResponse.json(productPriceHistory, { status: 200 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    } else {
      return NextResponse.json(err, { status: 500 })
    }
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    const validatedParams = productPriceHistoryIdSchema.parse({ id })
    const { productPriceHistory } = await deleteProductPriceHistory(validatedParams.id)

    return NextResponse.json(productPriceHistory, { status: 200 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    } else {
      return NextResponse.json(err, { status: 500 })
    }
  }
}
