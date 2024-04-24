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

export async function POST(req: Request) {
  try {
    const validatedData = insertProductPriceHistoryLogParams.parse(await req.json());
    const { productPriceHistoryLog } = await createProductPriceHistoryLog(validatedData);

    revalidatePath("/productPriceHistoryLog"); // optional - assumes you will have named route same as entity

    return NextResponse.json(productPriceHistoryLog, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
}
