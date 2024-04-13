import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import {
  createShoppingProduct,
  deleteShoppingProduct,
  updateShoppingProduct,
} from '@/lib/api/shoppingProducts/mutations'
import {
  shoppingProductIdSchema,
  insertShoppingProductParams,
  updateShoppingProductParams,
} from '@/lib/db/schema/shoppingProducts'

export async function POST(request: Request) {
  try {
    const validatedData = insertShoppingProductParams.parse(await request.json())
    const { shoppingProduct } = await createShoppingProduct(validatedData)

    revalidatePath('/shoppingProducts') // optional - assumes you will have named route same as entity

    return NextResponse.json(shoppingProduct, { status: 201 })
  } catch (error) {
    return error instanceof z.ZodError ? NextResponse.json({ error: error.issues }, { status: 400 }) : NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const validatedData = updateShoppingProductParams.parse(await request.json())
    const validatedParameters = shoppingProductIdSchema.parse({ id })

    const { shoppingProduct } = await updateShoppingProduct(
      validatedParameters.id,
      validatedData
    )

    return NextResponse.json(shoppingProduct, { status: 200 })
  } catch (error) {
    return error instanceof z.ZodError ? NextResponse.json({ error: error.issues }, { status: 400 }) : NextResponse.json(error, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const validatedParameters = shoppingProductIdSchema.parse({ id })
    const { shoppingProduct } = await deleteShoppingProduct(validatedParameters.id)

    return NextResponse.json(shoppingProduct, { status: 200 })
  } catch (error) {
    return error instanceof z.ZodError ? NextResponse.json({ error: error.issues }, { status: 400 }) : NextResponse.json(error, { status: 500 });
  }
}
