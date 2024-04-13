'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import type { CompleteShoppingList } from '@/lib/db/schema/shoppingLists';
import { type ShoppingList } from '@/lib/db/schema/shoppingLists'
import Modal from '@/components/shared/Modal'

import { useOptimisticShoppingLists } from '@/app/(app)/shopping-lists/useOptimisticShoppingLists'
import { Button } from '@/components/ui/button'
import ShoppingListForm from './ShoppingListForm'
import { PlusIcon } from 'lucide-react'

type TOpenModal = (shoppingList?: ShoppingList) => void

export default function ShoppingListList({
  shoppingLists,
}: {
  shoppingLists: CompleteShoppingList[]
}) {
  const { optimisticShoppingLists, addOptimisticShoppingList } =
    useOptimisticShoppingLists(shoppingLists)
  const [open, setOpen] = useState(false)
  const [activeShoppingList, setActiveShoppingList] = useState<ShoppingList | null>(
    null
  )
  const openModal = (shoppingList?: ShoppingList) => {
    setOpen(true)
    shoppingList ? setActiveShoppingList(shoppingList) : setActiveShoppingList(null)
  }
  const closeModal = () => setOpen(false)

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeShoppingList ? 'Edit ShoppingList' : 'Create Shopping List'}
      >
        <ShoppingListForm
          shoppingList={activeShoppingList}
          addOptimistic={addOptimisticShoppingList}
          openModal={openModal}
          closeModal={closeModal}
        />
      </Modal>
      <div className='absolute right-0 top-0 '>
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticShoppingLists.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticShoppingLists.map((shoppingList) => (
            <ShoppingList
              shoppingList={shoppingList}
              key={shoppingList.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

const ShoppingList = ({
  shoppingList,
  openModal,
}: {
  shoppingList: CompleteShoppingList
  openModal: TOpenModal
}) => {
  const optimistic = shoppingList.id === 'optimistic'
  const deleting = shoppingList.id === 'delete'
  const mutating = optimistic || deleting
  const pathname = usePathname()
  const basePath = pathname.includes('shopping-lists')
    ? pathname
    : pathname + '/shopping-lists/'

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : ''
      )}
    >
      <div className='w-full'>
        <div>{shoppingList.description}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + shoppingList.id}>Edit</Link>
      </Button>
    </li>
  )
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className='text-center'>
      <h3 className='mt-2 text-sm font-semibold text-secondary-foreground'>
        No shopping lists
      </h3>
      <p className='mt-1 text-sm text-muted-foreground'>
        Get started by creating a new shopping list.
      </p>
      <div className='mt-6'>
        <Button onClick={() => openModal()}>
          <PlusIcon className='h-4' /> New Shopping Lists{' '}
        </Button>
      </div>
    </div>
  )
}
