import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createProductPriceHistoryLog,
} from "@/lib/api/productPriceHistoryLog/mutations";
import {
  productPriceHistoryLogIdSchema,
  insertProductPriceHistoryLogParams,
  updateProductPriceHistoryLogParams
} from "@/lib/db/schema_log_db/productPriceHistoryLog";

export async function POST(request: Request) {
  try {
    const validatedData = insertProductPriceHistoryLogParams.parse(await request.json());
    const { productPriceHistoryLog } = await createProductPriceHistoryLog(validatedData);

    revalidatePath("/productPriceHistoryLog"); // optional - assumes you will have named route same as entity

    return NextResponse.json(productPriceHistoryLog, { status: 201 });
  } catch (error) {
    return error instanceof z.ZodError ? NextResponse.json({ error: error.issues }, { status: 400 }) : NextResponse.json({ error: error }, { status: 500 });
  }
}
