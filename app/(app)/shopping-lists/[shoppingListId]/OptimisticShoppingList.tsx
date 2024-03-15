"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/shopping-lists/useOptimisticShoppingLists";
import { type ShoppingList } from "@/lib/db/schema/shoppingLists";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import ShoppingListForm from "@/components/shoppingLists/ShoppingListForm";


export default function OptimisticShoppingList({ 
  shoppingList,
   
}: { 
  shoppingList: ShoppingList; 
  
  
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: ShoppingList) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticShoppingList, setOptimisticShoppingList] = useOptimistic(shoppingList);
  const updateShoppingList: TAddOptimistic = (input) =>
    setOptimisticShoppingList({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <ShoppingListForm
          shoppingList={optimisticShoppingList}
          
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateShoppingList}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticShoppingList.description}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticShoppingList.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticShoppingList, null, 2)}
      </pre>
    </div>
  );
}
