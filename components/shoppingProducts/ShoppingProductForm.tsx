import { z } from 'zod'

import { useState, useTransition } from 'react'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useValidatedForm } from '@/lib/hooks/useValidatedForm'

import { type Action, cn } from '@/lib/utils'
import { type TAddOptimistic } from '@/app/(app)/shopping-products/useOptimisticShoppingProducts'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useBackPath } from '@/components/shared/BackButton'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { type ShoppingProduct, insertShoppingProductParams } from '@/lib/db/schema/shoppingProducts'
import {
  createShoppingProductAction,
  deleteShoppingProductAction,
  updateShoppingProductAction,
} from '@/lib/actions/shoppingProducts'
import { type Product, type ProductId } from '@/lib/db/schema/products'
import { type ShoppingList, type ShoppingListId } from '@/lib/db/schema/shoppingLists'

const ShoppingProductForm = ({
  products,
  productId,
  shoppingLists,
  shoppingListId,
  shoppingProduct,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  shoppingProduct?: ShoppingProduct | null
  products: Product[]
  productId?: ProductId
  shoppingLists: ShoppingList[]
  shoppingListId?: ShoppingListId
  openModal?: (shoppingProduct?: ShoppingProduct) => void
  closeModal?: () => void
  addOptimistic?: TAddOptimistic
  postSuccess?: () => void
}) => {
  const { errors, hasErrors, setErrors, handleChange } = useValidatedForm<ShoppingProduct>(insertShoppingProductParams)
  const editing = !!shoppingProduct?.id

  const [isDeleting, setIsDeleting] = useState(false)
  const [pending, startMutation] = useTransition()

  const router = useRouter()
  const backpath = useBackPath('shopping-products')

  const onSuccess = (action: Action, data?: { error: string; values: ShoppingProduct }) => {
    const failed = Boolean(data?.error)
    if (failed) {
      openModal && openModal(data?.values)
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? 'Error',
      })
    } else {
      router.refresh()
      postSuccess && postSuccess()
      toast.success(`ShoppingProduct ${action}d!`)
      if (action === 'delete') router.push(backpath)
    }
  }

  const handleSubmit = async (data: FormData) => {
    setErrors(null)

    const payload = Object.fromEntries(data.entries())
    const shoppingProductParsed = await insertShoppingProductParams.safeParseAsync({
      productId,
      shoppingListId,
      ...payload,
    })
    if (!shoppingProductParsed.success) {
      setErrors(shoppingProductParsed?.error.flatten().fieldErrors)
      return
    }

    closeModal && closeModal()
    const values = shoppingProductParsed.data
    const pendingShoppingProduct: ShoppingProduct = {
      id: shoppingProduct?.id ?? '',
      ...values,
    }
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingShoppingProduct,
            action: editing ? 'update' : 'create',
          })

        const error = editing
          ? await updateShoppingProductAction({ ...values, id: shoppingProduct.id })
          : await createShoppingProductAction(values)

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingShoppingProduct,
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
            defaultValue={shoppingProduct?.productId}
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

      {shoppingListId ? null : (
        <div>
          <Label className={cn('mb-2 inline-block', errors?.shoppingListId ? 'text-destructive' : '')}>ShoppingList</Label>
          <Select
            defaultValue={shoppingProduct?.shoppingListId}
            name='shoppingListId'
          >
            <SelectTrigger className={cn(errors?.shoppingListId ? 'ring ring-destructive' : '')}>
              <SelectValue placeholder='Select a shoppingList' />
            </SelectTrigger>
            <SelectContent>
              {shoppingLists?.map((shoppingList) => (
                <SelectItem
                  key={shoppingList.id}
                  value={shoppingList.id.toString()}
                >
                  {shoppingList.id}
                  {/* TODO: Replace with a field from the shoppingList model */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className='pt-4'>
            <Input
              name='quantity'
              defaultValue={shoppingProduct?.quantity ?? '0'}
            />
          </div>
          {errors?.shoppingListId ? (
            <p className='text-xs text-destructive mt-2'>{errors.shoppingListId[0]}</p>
          ) : (
            <div className='h-6' />
          )}
        </div>
      )}
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
              addOptimistic && addOptimistic({ action: 'delete', data: shoppingProduct })
              const error = await deleteShoppingProductAction(shoppingProduct.id)
              setIsDeleting(false)
              const errorFormatted = {
                error: error ?? 'Error',
                values: shoppingProduct,
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

export default ShoppingProductForm

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
      {editing ? `Sav${isUpdating ? 'ing...' : 'e'}` : `Creat${isCreating ? 'ing...' : 'e'}`}
    </Button>
  )
}
