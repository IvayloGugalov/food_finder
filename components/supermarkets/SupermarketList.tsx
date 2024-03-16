'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { type Supermarket, CompleteSupermarket } from '@/lib/db/schema/supermarkets'
import Modal from '@/components/shared/Modal'

import { useOptimisticSupermarkets } from '@/app/(app)/supermarkets/useOptimisticSupermarkets'
import { Button } from '@/components/ui/button'
import SupermarketForm from './SupermarketForm'
import { PlusIcon } from 'lucide-react'

type TOpenModal = (supermarket?: Supermarket) => void

export default function SupermarketList({ supermarkets }: { supermarkets: CompleteSupermarket[] }) {
  const { optimisticSupermarkets, addOptimisticSupermarket } = useOptimisticSupermarkets(supermarkets)
  const [open, setOpen] = useState(false)
  const [activeSupermarket, setActiveSupermarket] = useState<Supermarket | null>(null)
  const openModal = (supermarket?: Supermarket) => {
    setOpen(true)
    supermarket ? setActiveSupermarket(supermarket) : setActiveSupermarket(null)
  }
  const closeModal = () => setOpen(false)

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeSupermarket ? 'Edit Supermarket' : 'Create Supermarket'}
      >
        <SupermarketForm
          supermarket={activeSupermarket}
          addOptimistic={addOptimisticSupermarket}
          openModal={openModal}
          closeModal={closeModal}
        />
      </Modal>
      <div className='absolute right-0 top-0 '>
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticSupermarkets.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticSupermarkets.map((supermarket) => (
            <Supermarket supermarket={supermarket} key={supermarket.id} openModal={openModal} />
          ))}
        </ul>
      )}
    </div>
  )
}

const Supermarket = ({
  supermarket,
  openModal,
}: {
  supermarket: CompleteSupermarket
  openModal: TOpenModal
}) => {
  const optimistic = supermarket.id === 'optimistic'
  const deleting = supermarket.id === 'delete'
  const mutating = optimistic || deleting
  const pathname = usePathname()
  const basePath = pathname.includes('supermarkets') ? pathname : pathname + '/supermarkets/'

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : ''
      )}
    >
      <div className='w-full'>
        <div>{supermarket.name}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + supermarket.id}>Edit</Link>
      </Button>
    </li>
  )
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className='text-center'>
      <h3 className='mt-2 text-sm font-semibold text-secondary-foreground'>No supermarkets</h3>
      <p className='mt-1 text-sm text-muted-foreground'>
        Get started by creating a new supermarket.
      </p>
      <div className='mt-6'>
        <Button onClick={() => openModal()}>
          <PlusIcon className='h-4' /> New Supermarkets{' '}
        </Button>
      </div>
    </div>
  )
}
