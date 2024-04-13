import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import {
  createSupermarket,
  deleteSupermarket,
  updateSupermarket,
} from '@/lib/api/supermarkets/mutations'
import {
  supermarketIdSchema,
  insertSupermarketParams,
  updateSupermarketParams,
} from '@/lib/db/schema/supermarkets'

export async function POST(request: Request) {
  try {
    const validatedData = insertSupermarketParams.parse(await request.json())
    const { supermarket } = await createSupermarket(validatedData)

    revalidatePath('/supermarkets') // optional - assumes you will have named route same as entity

    return NextResponse.json(supermarket, { status: 201 })
  } catch (error) {
    return error instanceof z.ZodError ? NextResponse.json({ error: error.issues }, { status: 400 }) : NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const validatedData = updateSupermarketParams.parse(await request.json())
    const validatedParameters = supermarketIdSchema.parse({ id })

    const { supermarket } = await updateSupermarket(validatedParameters.id, validatedData)

    return NextResponse.json(supermarket, { status: 200 })
  } catch (error) {
    return error instanceof z.ZodError ? NextResponse.json({ error: error.issues }, { status: 400 }) : NextResponse.json(error, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const validatedParameters = supermarketIdSchema.parse({ id })
    const { supermarket } = await deleteSupermarket(validatedParameters.id)

    return NextResponse.json(supermarket, { status: 200 })
  } catch (error) {
    return error instanceof z.ZodError ? NextResponse.json({ error: error.issues }, { status: 400 }) : NextResponse.json(error, { status: 500 });
  }
}
