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

export async function POST(request: Request) {
  try {
    const validatedData = insertProductPriceHistoryParams.parse(await request.json())
    const { productPriceHistory } = await createProductPriceHistory(validatedData)

    revalidatePath('/productPriceHistory') // optional - assumes you will have named route same as entity

    return NextResponse.json(productPriceHistory, { status: 201 })
  } catch (error) {
    return error instanceof z.ZodError ? NextResponse.json({ error: error.issues }, { status: 400 }) : NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const validatedData = updateProductPriceHistoryParams.parse(await request.json())
    const validatedParameters = productPriceHistoryIdSchema.parse({ id })

    const { productPriceHistory } = await updateProductPriceHistory(
      validatedParameters.id,
      validatedData
    )

    return NextResponse.json(productPriceHistory, { status: 200 })
  } catch (error) {
    return error instanceof z.ZodError ? NextResponse.json({ error: error.issues }, { status: 400 }) : NextResponse.json(error, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const validatedParameters = productPriceHistoryIdSchema.parse({ id })
    const { productPriceHistory } = await deleteProductPriceHistory(validatedParameters.id)

    return NextResponse.json(productPriceHistory, { status: 200 })
  } catch (error) {
    return error instanceof z.ZodError ? NextResponse.json({ error: error.issues }, { status: 400 }) : NextResponse.json(error, { status: 500 });
  }
}
