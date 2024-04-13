import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import {
  createProduct,
  deleteProduct,
  updateProduct,
} from '@/lib/api/products/mutations'
import {
  productIdSchema,
  insertProductParams,
  updateProductParams,
} from '@/lib/db/schema/products'

export async function POST(request: Request) {
  try {
    const validatedData = insertProductParams.parse(await request.json())
    const { product } = await createProduct(validatedData)

    revalidatePath('/products') // optional - assumes you will have named route same as entity

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return error instanceof z.ZodError ? NextResponse.json({ error: error.issues }, { status: 400 }) : NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const validatedData = updateProductParams.parse(await request.json())
    const validatedParameters = productIdSchema.parse({ id })

    const { product } = await updateProduct(validatedParameters.id, validatedData)

    return NextResponse.json(product, { status: 200 })
  } catch (error) {
    return error instanceof z.ZodError ? NextResponse.json({ error: error.issues }, { status: 400 }) : NextResponse.json(error, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const validatedParameters = productIdSchema.parse({ id })
    const { product } = await deleteProduct(validatedParameters.id)

    return NextResponse.json(product, { status: 200 })
  } catch (error) {
    return error instanceof z.ZodError ? NextResponse.json({ error: error.issues }, { status: 400 }) : NextResponse.json(error, { status: 500 });
  }
}
