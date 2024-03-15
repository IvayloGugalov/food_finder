"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/shopping-products/useOptimisticShoppingProducts";
import { type ShoppingProduct } from "@/lib/db/schema/shoppingProducts";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import ShoppingProductForm from "@/components/shoppingProducts/ShoppingProductForm";
import { type Product, type ProductId } from "@/lib/db/schema/products";
import { type ShoppingList, type ShoppingListId } from "@/lib/db/schema/shoppingLists";

export default function OptimisticShoppingProduct({ 
  shoppingProduct,
  products,
  productId,
  shoppingLists,
  shoppingListId 
}: { 
  shoppingProduct: ShoppingProduct; 
  
  products: Product[];
  productId?: ProductId
  shoppingLists: ShoppingList[];
  shoppingListId?: ShoppingListId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: ShoppingProduct) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticShoppingProduct, setOptimisticShoppingProduct] = useOptimistic(shoppingProduct);
  const updateShoppingProduct: TAddOptimistic = (input) =>
    setOptimisticShoppingProduct({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <ShoppingProductForm
          shoppingProduct={optimisticShoppingProduct}
          products={products}
        productId={productId}
        shoppingLists={shoppingLists}
        shoppingListId={shoppingListId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateShoppingProduct}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticShoppingProduct.productId}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticShoppingProduct.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticShoppingProduct, null, 2)}
      </pre>
    </div>
  );
}
