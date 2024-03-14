import { Suspense } from "react";

import Loading from "@/app/loading";
import SupermarketList from "@/components/supermarkets/SupermarketList";
import { getSupermarkets } from "@/lib/api/supermarkets/queries";

import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function SupermarketsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Supermarkets</h1>
        </div>
        <Supermarkets />
      </div>
    </main>
  );
}

const Supermarkets = async () => {
  await checkAuth();

  const { supermarkets } = await getSupermarkets();
  
  return (
    <Suspense fallback={<Loading />}>
      <SupermarketList supermarkets={supermarkets}  />
    </Suspense>
  );
};
