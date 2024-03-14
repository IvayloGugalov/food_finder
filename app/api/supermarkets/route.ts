import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createSupermarket,
  deleteSupermarket,
  updateSupermarket,
} from "@/lib/api/supermarkets/mutations";
import { 
  supermarketIdSchema,
  insertSupermarketParams,
  updateSupermarketParams 
} from "@/lib/db/schema/supermarkets";

export async function POST(req: Request) {
  try {
    const validatedData = insertSupermarketParams.parse(await req.json());
    const { supermarket } = await createSupermarket(validatedData);

    revalidatePath("/supermarkets"); // optional - assumes you will have named route same as entity

    return NextResponse.json(supermarket, { status: 201 });
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

    const validatedData = updateSupermarketParams.parse(await req.json());
    const validatedParams = supermarketIdSchema.parse({ id });

    const { supermarket } = await updateSupermarket(validatedParams.id, validatedData);

    return NextResponse.json(supermarket, { status: 200 });
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

    const validatedParams = supermarketIdSchema.parse({ id });
    const { supermarket } = await deleteSupermarket(validatedParams.id);

    return NextResponse.json(supermarket, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
