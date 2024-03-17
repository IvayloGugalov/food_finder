import { Suspense } from "react";

import Loading from "@/app/loading";
import ProductPriceHistoryList from "@/components/productPriceHistory/ProductPriceHistoryList";
import { getProductPriceHistories } from "@/lib/api/productPriceHistory/queries";
import { getProducts } from "@/lib/api/products/queries";

export const revalidate = 0;

export default async function ProductPriceHistoryPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Product Price History</h1>
        </div>
        <ProductPriceHistory />
      </div>
    </main>
  );
}

const ProductPriceHistory = async () => {

  const { productPriceHistory } = await getProductPriceHistories();
  const { products } = await getProducts();
  return (
    <Suspense fallback={<Loading />}>
      <ProductPriceHistoryList productPriceHistory={productPriceHistory} products={products} />
    </Suspense>
  );
};
