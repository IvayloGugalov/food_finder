import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createShoppingList,
  deleteShoppingList,
  updateShoppingList,
} from "@/lib/api/shoppingLists/mutations";
import { 
  shoppingListIdSchema,
  insertShoppingListParams,
  updateShoppingListParams 
} from "@/lib/db/schema/shoppingLists";

export async function POST(req: Request) {
  try {
    const validatedData = insertShoppingListParams.parse(await req.json());
    const { shoppingList } = await createShoppingList(validatedData);

    revalidatePath("/shoppingLists"); // optional - assumes you will have named route same as entity

    return NextResponse.json(shoppingList, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
}


export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedData = updateShoppingListParams.parse(await req.json());
    const validatedParams = shoppingListIdSchema.parse({ id });

    const { shoppingList } = await updateShoppingList(validatedParams.id, validatedData);

    return NextResponse.json(shoppingList, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedParams = shoppingListIdSchema.parse({ id });
    const { shoppingList } = await deleteShoppingList(validatedParams.id);

    return NextResponse.json(shoppingList, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
