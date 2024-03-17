import { z } from 'zod'

import { useState, useTransition } from 'react'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useValidatedForm } from '@/lib/hooks/useValidatedForm'

import { type Action, cn } from '@/lib/utils'
import { type TAddOptimistic } from '@/app/(app)/product-price-history/useOptimisticProductPriceHistory'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useBackPath } from '@/components/shared/BackButton'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'

import { type ProductPriceHistory, insertProductPriceHistoryParams } from '@/lib/db/schema/productPriceHistory'
import {
  createProductPriceHistoryAction,
  deleteProductPriceHistoryAction,
  updateProductPriceHistoryAction,
} from '@/lib/actions/productPriceHistory'
import { type Product, type ProductId } from '@/lib/db/schema/products'

const ProductPriceHistoryForm = ({
  products,
  productId,
  productPriceHistory,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  productPriceHistory?: ProductPriceHistory | null
  products: Product[]
  productId?: ProductId
  openModal?: (productPriceHistory?: ProductPriceHistory) => void
  closeModal?: () => void
  addOptimistic?: TAddOptimistic
  postSuccess?: () => void
}) => {
  const { errors, hasErrors, setErrors, handleChange } = useValidatedForm<ProductPriceHistory>(insertProductPriceHistoryParams)
  const editing = !!productPriceHistory?.id
  const [weekDayStart, setWeekDayStart] = useState<Date | undefined>(productPriceHistory?.weekDayStart)
  const [weekDayEnd, setWeekDayEnd] = useState<Date | undefined>(productPriceHistory?.weekDayEnd)

  const [isDeleting, setIsDeleting] = useState(false)
  const [pending, startMutation] = useTransition()

  const router = useRouter()
  const backpath = useBackPath('product-price-history')

  const onSuccess = (action: Action, data?: { error: string; values: ProductPriceHistory }) => {
    const failed = Boolean(data?.error)
    if (failed) {
      openModal && openModal(data?.values)
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? 'Error',
      })
    } else {
      router.refresh()
      postSuccess && postSuccess()
      toast.success(`ProductPriceHistory ${action}d!`)
      if (action === 'delete') router.push(backpath)
    }
  }

  const handleSubmit = async (data: FormData) => {
    setErrors(null)

    const payload = Object.fromEntries(data.entries())
    const productPriceHistoryParsed = await insertProductPriceHistoryParams.safeParseAsync({ productId, ...payload })
    if (!productPriceHistoryParsed.success) {
      setErrors(productPriceHistoryParsed?.error.flatten().fieldErrors)
      return
    }

    closeModal && closeModal()
    const values = productPriceHistoryParsed.data
    const pendingProductPriceHistory: ProductPriceHistory = {
      updatedAt: productPriceHistory?.updatedAt ?? new Date(),
      createdAt: productPriceHistory?.createdAt ?? new Date(),
      id: productPriceHistory?.id ?? '',
      ...values,
    }
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingProductPriceHistory,
            action: editing ? 'update' : 'create',
          })

        const error = editing
          ? await updateProductPriceHistoryAction({ ...values, id: productPriceHistory.id })
          : await createProductPriceHistoryAction(values)

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingProductPriceHistory,
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
    <form
      action={handleSubmit}
      onChange={handleChange}
      className={'space-y-8'}
    >
      {/* Schema fields start */}

      {productId ? null : (
        <div>
          <Label className={cn('mb-2 inline-block', errors?.productId ? 'text-destructive' : '')}>Product</Label>
          <Select
            defaultValue={productPriceHistory?.productId}
            name='productId'
          >
            <SelectTrigger className={cn(errors?.productId ? 'ring ring-destructive' : '')}>
              <SelectValue placeholder='Select a product' />
            </SelectTrigger>
            <SelectContent>
              {products?.map((product) => (
                <SelectItem
                  key={product.id}
                  value={product.id.toString()}
                >
                  {product.id}
                  {/* TODO: Replace with a field from the product model */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.productId ? <p className='text-xs text-destructive mt-2'>{errors.productId[0]}</p> : <div className='h-6' />}
        </div>
      )}
      <div>
        <Label className={cn('mb-2 inline-block', errors?.weekDayStart ? 'text-destructive' : '')}>Week Day Start</Label>
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
                !productPriceHistory?.weekDayStart && 'text-muted-foreground'
              )}
            >
              {weekDayStart ? <span>{format(weekDayStart, 'PPP')}</span> : <span>Pick a date</span>}
              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className='w-auto p-0'
            align='start'
          >
            <Calendar
              mode='single'
              onSelect={(e) => setWeekDayStart(e)}
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
        <Label className={cn('mb-2 inline-block', errors?.weekDayEnd ? 'text-destructive' : '')}>Week Day End</Label>
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
              className={cn('w-[240px] pl-3 text-left font-normal', !productPriceHistory?.weekDayEnd && 'text-muted-foreground')}
            >
              {weekDayEnd ? <span>{format(weekDayEnd, 'PPP')}</span> : <span>Pick a date</span>}
              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className='w-auto p-0'
            align='start'
          >
            <Calendar
              mode='single'
              onSelect={(e) => setWeekDayEnd(e)}
              selected={weekDayEnd}
              disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors?.weekDayEnd ? <p className='text-xs text-destructive mt-2'>{errors.weekDayEnd[0]}</p> : <div className='h-6' />}
      </div>
      <div>
        <Label className={cn('mb-2 inline-block', errors?.price ? 'text-destructive' : '')}>Price</Label>
        <Input
          type='text'
          name='price'
          className={cn(errors?.price ? 'ring ring-destructive' : '')}
          defaultValue={productPriceHistory?.price ?? ''}
        />
        {errors?.price ? <p className='text-xs text-destructive mt-2'>{errors.price[0]}</p> : <div className='h-6' />}
      </div>
      <div>
        <Label className={cn('mb-2 inline-block', errors?.oldPrice ? 'text-destructive' : '')}>Old Price</Label>
        <Input
          type='text'
          name='oldPrice'
          className={cn(errors?.oldPrice ? 'ring ring-destructive' : '')}
          defaultValue={productPriceHistory?.oldPrice ?? ''}
        />
        {errors?.oldPrice ? <p className='text-xs text-destructive mt-2'>{errors.oldPrice[0]}</p> : <div className='h-6' />}
      </div>
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton
        errors={hasErrors}
        editing={editing}
      />

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
              addOptimistic && addOptimistic({ action: 'delete', data: productPriceHistory })
              const error = await deleteProductPriceHistoryAction(productPriceHistory.id)
              setIsDeleting(false)
              const errorFormatted = {
                error: error ?? 'Error',
                values: productPriceHistory,
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

export default ProductPriceHistoryForm

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
      {editing ? `Sav${isUpdating ? 'ing...' : 'e'}` : `Creat${isCreating ? 'ing...' : 'e'}`}
    </Button>
  )
}
