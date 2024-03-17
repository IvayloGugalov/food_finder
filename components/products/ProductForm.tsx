import { z } from 'zod'

import { useState, useTransition } from 'react'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useValidatedForm } from '@/lib/hooks/useValidatedForm'

import { type Action, cn } from '@/lib/utils'
import { type TAddOptimistic } from '@/app/(app)/products/useOptimisticProducts'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useBackPath } from '@/components/shared/BackButton'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { type Product, insertProductParams } from '@/lib/db/schema/products'
import {
  createProductAction,
  deleteProductAction,
  updateProductAction,
} from '@/lib/actions/products'
import { type Supermarket, type SupermarketId } from '@/lib/db/schema/supermarkets'

const ProductForm = ({
  supermarkets,
  supermarketId,
  product,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  product?: Product | null
  supermarkets: Supermarket[]
  supermarketId?: SupermarketId
  openModal?: (product?: Product) => void
  closeModal?: () => void
  addOptimistic?: TAddOptimistic
  postSuccess?: () => void
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Product>(insertProductParams)
  const editing = !!product?.id
  const [validFrom, setValidFrom] = useState<Date | undefined>(new Date(product?.validFrom ?? ''))
  const [validUntil, setValidUntil] = useState<Date | undefined>(new Date(product?.validUntil ?? ''))

  const [isDeleting, setIsDeleting] = useState(false)
  const [pending, startMutation] = useTransition()

  const router = useRouter()
  const backpath = useBackPath('products')

  const onSuccess = (action: Action, data?: { error: string; values: Product }) => {
    const failed = Boolean(data?.error)
    if (failed) {
      openModal && openModal(data?.values)
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? 'Error',
      })
    } else {
      router.refresh()
      postSuccess && postSuccess()
      toast.success(`Product ${action}d!`)
      if (action === 'delete') router.push(backpath)
    }
  }

  const handleSubmit = async (data: FormData) => {
    setErrors(null)

    const payload = Object.fromEntries(data.entries())
    const productParsed = await insertProductParams.safeParseAsync({
      supermarketId,
      ...payload,
    })
    if (!productParsed.success) {
      setErrors(productParsed?.error.flatten().fieldErrors)
      return
    }

    closeModal && closeModal()
    const values = productParsed.data
    const pendingProduct: Product = {
      updatedAt: product?.updatedAt ?? new Date(),
      createdAt: product?.createdAt ?? new Date(),
      id: product?.id ?? '',
      ...values,
    }
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingProduct,
            action: editing ? 'update' : 'create',
          })

        const error = editing
          ? await updateProductAction({ ...values, id: product.id })
          : await createProductAction(values)

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingProduct,
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
          className={cn('mb-2 inline-block', errors?.name ? 'text-destructive' : '')}
        >
          Name
        </Label>
        <Input
          type='text'
          name='name'
          className={cn(errors?.name ? 'ring ring-destructive' : '')}
          defaultValue={product?.name ?? ''}
        />
        {errors?.name ? (
          <p className='text-xs text-destructive mt-2'>{errors.name[0]}</p>
        ) : (
          <div className='h-6' />
        )}
      </div>
      <div>
        <Label
          className={cn(
            'mb-2 inline-block',
            errors?.quantity ? 'text-destructive' : ''
          )}
        >
          Quantity
        </Label>
        <Input
          type='text'
          name='quantity'
          className={cn(errors?.quantity ? 'ring ring-destructive' : '')}
          defaultValue={product?.quantity ?? ''}
        />
        {errors?.quantity ? (
          <p className='text-xs text-destructive mt-2'>{errors.quantity[0]}</p>
        ) : (
          <div className='h-6' />
        )}
      </div>
      <div>
        <Label
          className={cn('mb-2 inline-block', errors?.price ? 'text-destructive' : '')}
        >
          Price
        </Label>
        <Input
          type='text'
          name='price'
          className={cn(errors?.price ? 'ring ring-destructive' : '')}
          defaultValue={product?.price ?? ''}
        />
        {errors?.price ? (
          <p className='text-xs text-destructive mt-2'>{errors.price[0]}</p>
        ) : (
          <div className='h-6' />
        )}
      </div>
      <div>
        <Label
          className={cn(
            'mb-2 inline-block',
            errors?.oldPrice ? 'text-destructive' : ''
          )}
        >
          Old Price
        </Label>
        <Input
          type='text'
          name='oldPrice'
          className={cn(errors?.oldPrice ? 'ring ring-destructive' : '')}
          defaultValue={product?.oldPrice ?? ''}
        />
        {errors?.oldPrice ? (
          <p className='text-xs text-destructive mt-2'>{errors.oldPrice[0]}</p>
        ) : (
          <div className='h-6' />
        )}
      </div>
      <div>
        <Label
          className={cn(
            'mb-2 inline-block',
            errors?.category ? 'text-destructive' : ''
          )}
        >
          Category
        </Label>
        <Input
          type='text'
          name='category'
          className={cn(errors?.category ? 'ring ring-destructive' : '')}
          defaultValue={product?.category ?? ''}
        />
        {errors?.category ? (
          <p className='text-xs text-destructive mt-2'>{errors.category[0]}</p>
        ) : (
          <div className='h-6' />
        )}
      </div>
      <div>
        <Label
          className={cn('mb-2 inline-block', errors?.picUrl ? 'text-destructive' : '')}
        >
          Pic Url
        </Label>
        <Input
          type='text'
          name='picUrl'
          className={cn(errors?.picUrl ? 'ring ring-destructive' : '')}
          defaultValue={product?.picUrl ?? ''}
        />
        {errors?.picUrl ? (
          <p className='text-xs text-destructive mt-2'>{errors.picUrl[0]}</p>
        ) : (
          <div className='h-6' />
        )}
      </div>
      <div>
        <Label
          className={cn(
            'mb-2 inline-block',
            errors?.validFrom ? 'text-destructive' : ''
          )}
        >
          Valid From
        </Label>
        <br />
        <Popover>
          <Input
            name='validFrom'
            onChange={() => {}}
            readOnly
            value={validFrom?.toUTCString() ?? new Date().toUTCString()}
            className='hidden'
          />

          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-[240px] pl-3 text-left font-normal',
                !product?.validFrom && 'text-muted-foreground'
              )}
            >
              {validFrom ? (
                <span>{format(validFrom, 'PPP')}</span>
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              mode='single'
              onSelect={(e) => setValidFrom(e)}
              selected={validFrom}
              disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors?.validFrom ? (
          <p className='text-xs text-destructive mt-2'>{errors.validFrom[0]}</p>
        ) : (
          <div className='h-6' />
        )}
      </div>
      <div>
        <Label
          className={cn(
            'mb-2 inline-block',
            errors?.validUntil ? 'text-destructive' : ''
          )}
        >
          Valid Until
        </Label>
        <br />
        <Popover>
          <Input
            name='validUntil'
            onChange={() => {}}
            readOnly
            value={validUntil?.toUTCString() ?? new Date().toUTCString()}
            className='hidden'
          />

          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-[240px] pl-3 text-left font-normal',
                !product?.validUntil && 'text-muted-foreground'
              )}
            >
              {validUntil ? (
                <span>{format(validUntil, 'PPP')}</span>
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              mode='single'
              onSelect={(e) => setValidUntil(e)}
              selected={validUntil}
              disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors?.validUntil ? (
          <p className='text-xs text-destructive mt-2'>{errors.validUntil[0]}</p>
        ) : (
          <div className='h-6' />
        )}
      </div>

      {supermarketId ? null : (
        <div>
          <Label
            className={cn(
              'mb-2 inline-block',
              errors?.supermarketId ? 'text-destructive' : ''
            )}
          >
            Supermarket
          </Label>
          <Select defaultValue={product?.supermarketId} name='supermarketId'>
            <SelectTrigger
              className={cn(errors?.supermarketId ? 'ring ring-destructive' : '')}
            >
              <SelectValue placeholder='Select a supermarket' />
            </SelectTrigger>
            <SelectContent>
              {supermarkets?.map((supermarket) => (
                <SelectItem key={supermarket.id} value={supermarket.id.toString()}>
                  {supermarket.id}
                  {/* TODO: Replace with a field from the supermarket model */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.supermarketId ? (
            <p className='text-xs text-destructive mt-2'>{errors.supermarketId[0]}</p>
          ) : (
            <div className='h-6' />
          )}
        </div>
      )}
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
              addOptimistic && addOptimistic({ action: 'delete', data: product })
              const error = await deleteProductAction(product.id)
              setIsDeleting(false)
              const errorFormatted = {
                error: error ?? 'Error',
                values: product,
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

export default ProductForm

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
