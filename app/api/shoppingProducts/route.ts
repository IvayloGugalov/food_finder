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

export async function POST(req: Request) {
  try {
    const validatedData = insertShoppingProductParams.parse(await req.json())
    const { shoppingProduct } = await createShoppingProduct(validatedData)

    revalidatePath('/shoppingProducts') // optional - assumes you will have named route same as entity

    return NextResponse.json(shoppingProduct, { status: 201 })
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

    const validatedData = updateShoppingProductParams.parse(await req.json())
    const validatedParams = shoppingProductIdSchema.parse({ id })

    const { shoppingProduct } = await updateShoppingProduct(validatedParams.id, validatedData)

    return NextResponse.json(shoppingProduct, { status: 200 })
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

    const validatedParams = shoppingProductIdSchema.parse({ id })
    const { shoppingProduct } = await deleteShoppingProduct(validatedParams.id)

    return NextResponse.json(shoppingProduct, { status: 200 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    } else {
      return NextResponse.json(err, { status: 500 })
    }
  }
}
