import { Suspense } from "react";

import Loading from "@/app/loading";
import ShoppingListList from "@/components/shoppingLists/ShoppingListList";
import { getShoppingLists } from "@/lib/api/shoppingLists/queries";

import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function ShoppingListsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Shopping Lists</h1>
        </div>
        <ShoppingLists />
      </div>
    </main>
  );
}

const ShoppingLists = async () => {
  await checkAuth();

  const { shoppingLists } = await getShoppingLists();
  
  return (
    <Suspense fallback={<Loading />}>
      <ShoppingListList shoppingLists={shoppingLists}  />
    </Suspense>
  );
};
