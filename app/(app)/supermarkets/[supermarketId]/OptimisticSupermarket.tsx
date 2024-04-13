'use client'

import { useOptimistic, useState } from 'react'
import type { TAddOptimistic } from '@/app/(app)/supermarkets/useOptimisticSupermarkets'
import { type Supermarket } from '@/lib/db/schema/supermarkets'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import Modal from '@/components/shared/Modal'
import SupermarketForm from '@/components/supermarkets/SupermarketForm'

export default function OptimisticSupermarket({
  supermarket,
}: {
  supermarket: Supermarket
}) {
  const [open, setOpen] = useState(false)
  const openModal = (_?: Supermarket) => {
    setOpen(true)
  }
  const closeModal = () => setOpen(false)
  const [optimisticSupermarket, setOptimisticSupermarket] = useOptimistic(supermarket)
  const updateSupermarket: TAddOptimistic = (input) =>
    setOptimisticSupermarket({ ...input.data })

  return (
    <div className='m-4'>
      <Modal open={open} setOpen={setOpen}>
        <SupermarketForm
          supermarket={optimisticSupermarket}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateSupermarket}
        />
      </Modal>
      <div className='flex justify-between items-end mb-4'>
        <h1 className='font-semibold text-2xl'>{optimisticSupermarket.name}</h1>
        <Button className='' onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          'bg-secondary p-4 rounded-lg break-all text-wrap',
          optimisticSupermarket.id === 'optimistic' ? 'animate-pulse' : ''
        )}
      >
        {JSON.stringify(optimisticSupermarket, null, 2)}
      </pre>
    </div>
  )
}
