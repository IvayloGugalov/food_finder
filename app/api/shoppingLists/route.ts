import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import {
  createShoppingList,
  deleteShoppingList,
  updateShoppingList,
} from '@/lib/api/shoppingLists/mutations'
import {
  shoppingListIdSchema,
  insertShoppingListParams,
  updateShoppingListParams,
} from '@/lib/db/schema/shoppingLists'

export async function POST(request: Request) {
  try {
    const validatedData = insertShoppingListParams.parse(await request.json())
    const { shoppingList } = await createShoppingList(validatedData)

    revalidatePath('/shoppingLists') // optional - assumes you will have named route same as entity

    return NextResponse.json(shoppingList, { status: 201 })
  } catch (error) {
    return error instanceof z.ZodError ? NextResponse.json({ error: error.issues }, { status: 400 }) : NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const validatedData = updateShoppingListParams.parse(await request.json())
    const validatedParameters = shoppingListIdSchema.parse({ id })

    const { shoppingList } = await updateShoppingList(validatedParameters.id, validatedData)

    return NextResponse.json(shoppingList, { status: 200 })
  } catch (error) {
    return error instanceof z.ZodError ? NextResponse.json({ error: error.issues }, { status: 400 }) : NextResponse.json(error, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const validatedParameters = shoppingListIdSchema.parse({ id })
    const { shoppingList } = await deleteShoppingList(validatedParameters.id)

    return NextResponse.json(shoppingList, { status: 200 })
  } catch (error) {
    return error instanceof z.ZodError ? NextResponse.json({ error: error.issues }, { status: 400 }) : NextResponse.json(error, { status: 500 });
  }
}
