import { z } from 'zod'

import { useState, useTransition } from 'react'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useValidatedForm } from '@/lib/hooks/useValidatedForm'

import { type Action, cn } from '@/lib/utils'
import { type TAddOptimistic } from '@/app/(app)/shopping-lists/useOptimisticShoppingLists'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useBackPath } from '@/components/shared/BackButton'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'

import {
  type ShoppingList,
  insertShoppingListParams,
} from '@/lib/db/schema/shoppingLists'
import {
  createShoppingListAction,
  deleteShoppingListAction,
  updateShoppingListAction,
} from '@/lib/actions/shoppingLists'

const ShoppingListForm = ({
  shoppingList,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  shoppingList?: ShoppingList | null
  openModal?: (shoppingList?: ShoppingList) => void
  closeModal?: () => void
  addOptimistic?: TAddOptimistic
  postSuccess?: () => void
}) => {
  const { errors, hasErrors, setErrors, handleChange } = useValidatedForm<ShoppingList>(
    insertShoppingListParams
  )
  const editing = !!shoppingList?.id
  const [weekDayStart, setweekDayStart] = useState<Date | undefined>(
    new Date(shoppingList?.weekDayStart ?? '')
  )
  const [weekDayEnd, setweekDayEnd] = useState<Date | undefined>(
    new Date(shoppingList?.weekDayEnd ?? '')
  )

  const [isDeleting, setIsDeleting] = useState(false)
  const [pending, startMutation] = useTransition()

  const router = useRouter()
  const backpath = useBackPath('shopping-lists')

  const onSuccess = (
    action: Action,
    data?: { error: string; values: ShoppingList }
  ) => {
    const failed = Boolean(data?.error)
    if (failed) {
      openModal && openModal(data?.values)
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? 'Error',
      })
    } else {
      router.refresh()
      postSuccess && postSuccess()
      toast.success(`ShoppingList ${action}d!`)
      if (action === 'delete') router.push(backpath)
    }
  }

  const handleSubmit = async (data: FormData) => {
    setErrors(null)

    const payload = Object.fromEntries(data.entries())
    const shoppingListParsed = await insertShoppingListParams.safeParseAsync({
      ...payload,
    })
    if (!shoppingListParsed.success) {
      setErrors(shoppingListParsed?.error.flatten().fieldErrors)
      return
    }

    closeModal && closeModal()
    const values = shoppingListParsed.data
    const pendingShoppingList: ShoppingList = {
      updatedAt: shoppingList?.updatedAt ?? new Date(),
      createdAt: shoppingList?.createdAt ?? new Date(),
      id: shoppingList?.id ?? '',
      userId: shoppingList?.userId ?? '',
      ...values,
    }
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingShoppingList,
            action: editing ? 'update' : 'create',
          })

        const error = editing
          ? await updateShoppingListAction({ ...values, id: shoppingList.id })
          : await createShoppingListAction(values)

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingShoppingList,
        }
        onSuccess(editing ? 'update' : 'create', error ? errorFormatted : undefined)
      })
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors)
      }
    }
  }

  return (
    <form action={handleSubmit} onChange={handleChange} className={'space-y-8'}>
      {/* Schema fields start */}
      <div>
        <Label
          className={cn(
            'mb-2 inline-block',
            errors?.description ? 'text-destructive' : ''
          )}
        >
          Description
        </Label>
        <Input
          type='text'
          name='description'
          className={cn(errors?.description ? 'ring ring-destructive' : '')}
          defaultValue={shoppingList?.description ?? ''}
        />
        {errors?.description ? (
          <p className='text-xs text-destructive mt-2'>{errors.description[0]}</p>
        ) : (
          <div className='h-6' />
        )}
      </div>
      <div>
        <Label
          className={cn(
            'mb-2 inline-block',
            errors?.weekDayStart ? 'text-destructive' : ''
          )}
        >
          Week Period
        </Label>
        <br />
        <Popover>
          <Input
            name='weekDayStart'
            onChange={() => {}}
            readOnly
            value={weekDayStart?.toUTCString() ?? new Date().toUTCString()}
            className='hidden'
          />

          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-[240px] pl-3 text-left font-normal',
                !shoppingList?.weekDayStart && 'text-muted-foreground'
              )}
            >
              {weekDayStart ? (
                <span>{format(weekDayStart, 'PPP')}</span>
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              mode='single'
              onSelect={(e) => setweekDayStart(e)}
              selected={weekDayStart}
              disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors?.weekDayStart ? (
          <p className='text-xs text-destructive mt-2'>{errors.weekDayStart[0]}</p>
        ) : (
          <div className='h-6' />
        )}
      </div>
      <div>
        <Label
          className={cn(
            'mb-2 inline-block',
            errors?.weekDayEnd ? 'text-destructive' : ''
          )}
        >
          Week Period
        </Label>
        <br />
        <Popover>
          <Input
            name='weekDayEnd'
            onChange={() => {}}
            readOnly
            value={weekDayEnd?.toUTCString() ?? new Date().toUTCString()}
            className='hidden'
          />

          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-[240px] pl-3 text-left font-normal',
                !shoppingList?.weekDayEnd && 'text-muted-foreground'
              )}
            >
              {weekDayEnd ? (
                <span>{format(weekDayEnd, 'PPP')}</span>
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              mode='single'
              onSelect={(e) => setweekDayEnd(e)}
              selected={weekDayEnd}
              disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors?.weekDayEnd ? (
          <p className='text-xs text-destructive mt-2'>{errors.weekDayEnd[0]}</p>
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
              addOptimistic && addOptimistic({ action: 'delete', data: shoppingList })
              const error = await deleteShoppingListAction(shoppingList.id)
              setIsDeleting(false)
              const errorFormatted = {
                error: error ?? 'Error',
                values: shoppingList,
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

export default ShoppingListForm

const SaveButton = ({ editing, errors }: { editing: Boolean; errors: boolean }) => {
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
