import { z } from 'zod'

import { useState, useTransition } from 'react'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useValidatedForm } from '@/lib/hooks/useValidatedForm'

import { type Action, cn } from '@/lib/utils'
import { type TAddOptimistic } from '@/app/(app)/supermarkets/useOptimisticSupermarkets'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useBackPath } from '@/components/shared/BackButton'

import { type Supermarket, insertSupermarketParams } from '@/lib/db/schema/supermarkets'
import {
  createSupermarketAction,
  deleteSupermarketAction,
  updateSupermarketAction,
} from '@/lib/actions/supermarkets'

const SupermarketForm = ({
  supermarket,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  supermarket?: Supermarket | null

  openModal?: (supermarket?: Supermarket) => void
  closeModal?: () => void
  addOptimistic?: TAddOptimistic
  postSuccess?: () => void
}) => {
  const { errors, hasErrors, setErrors, handleChange } = useValidatedForm<Supermarket>(
    insertSupermarketParams
  )
  const editing = !!supermarket?.id

  const [isDeleting, setIsDeleting] = useState(false)
  const [pending, startMutation] = useTransition()

  const router = useRouter()
  const backpath = useBackPath('supermarkets')

  const onSuccess = (action: Action, data?: { error: string; values: Supermarket }) => {
    const failed = Boolean(data?.error)
    if (failed) {
      openModal && openModal(data?.values)
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? 'Error',
      })
    } else {
      router.refresh()
      postSuccess && postSuccess()
      toast.success(`Supermarket ${action}d!`)
      if (action === 'delete') router.push(backpath)
    }
  }

  const handleSubmit = async (data: FormData) => {
    setErrors(null)

    const payload = Object.fromEntries(data.entries())
    const supermarketParsed = await insertSupermarketParams.safeParseAsync({
      ...payload,
    })
    if (!supermarketParsed.success) {
      setErrors(supermarketParsed?.error.flatten().fieldErrors)
      return
    }

    closeModal && closeModal()
    const values = supermarketParsed.data
    const pendingSupermarket: Supermarket = {
      updatedAt: supermarket?.updatedAt ?? new Date(),
      createdAt: supermarket?.createdAt ?? new Date(),
      id: supermarket?.id ?? '',
      ...values,
    }
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingSupermarket,
            action: editing ? 'update' : 'create',
          })

        const error = editing
          ? await updateSupermarketAction({ ...values, id: supermarket.id })
          : await createSupermarketAction(values)

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingSupermarket,
        }
        onSuccess(editing ? 'update' : 'create', error ? errorFormatted : undefined)
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors)
      }
    }
  }

  return (
    <form action={handleSubmit} onChange={handleChange} className={'space-y-8'}>
      {/* Schema fields start */}
      <div>
        <Label
          className={cn('mb-2 inline-block', errors?.name ? 'text-destructive' : '')}
        >
          Name
        </Label>
        <Input
          type='text'
          name='name'
          className={cn(errors?.name ? 'ring ring-destructive' : '')}
          defaultValue={supermarket?.name ?? ''}
        />
        {errors?.name ? (
          <p className='text-xs text-destructive mt-2'>{errors.name[0]}</p>
        ) : (
          <div className='h-6' />
        )}
      </div>
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type='button'
          disabled={isDeleting || pending || hasErrors}
          variant={'destructive'}
          onClick={() => {
            setIsDeleting(true)
            closeModal && closeModal()
            startMutation(async () => {
              addOptimistic && addOptimistic({ action: 'delete', data: supermarket })
              const error = await deleteSupermarketAction(supermarket.id)
              setIsDeleting(false)
              const errorFormatted = {
                error: error ?? 'Error',
                values: supermarket,
              }

              onSuccess('delete', error ? errorFormatted : undefined)
            })
          }}
        >
          Delet{isDeleting ? 'ing...' : 'e'}
        </Button>
      ) : null}
    </form>
  )
}

export default SupermarketForm

const SaveButton = ({ editing, errors }: { editing: boolean; errors: boolean }) => {
  const { pending } = useFormStatus()
  const isCreating = pending && editing === false
  const isUpdating = pending && editing === true
  return (
    <Button
      type='submit'
      className='mr-2'
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? 'ing...' : 'e'}`
        : `Creat${isCreating ? 'ing...' : 'e'}`}
    </Button>
  )
}
