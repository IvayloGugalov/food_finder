'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { z } from 'zod'
import { handleAddProductToCurrentWeekShoppingList } from '@/lib/actions/products'
import { CompleteProduct } from '@/lib/db/schema/products'
import { Action } from '@/lib/utils'
import { useBackPath } from '@/components/shared/BackButton'
import {
  ShoppingProduct,
  insertShoppingProductParams,
} from '@/lib/db/schema/shoppingProducts'
import { useValidatedForm } from './useValidatedForm'

export function useAddShoppingProduct() {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<ShoppingProduct>(insertShoppingProductParams)
  const [pending, startMutation] = useTransition()

  const router = useRouter()
  const backpath = useBackPath('products')

  const onSuccess = (
    action: Action,
    data?: { error: string; values: CompleteProduct }
  ) => {
    const failed = Boolean(data?.error)
    if (failed) {
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? 'Error',
      })
    } else {
      router.refresh()
      toast.success(`ShoppingProduct ${action}d!`)
      if (action === 'delete') router.push(backpath)
    }
  }

  const handleSubmitProductToShoppingList = async (product: CompleteProduct) => {
    try {
      startMutation(async () => {
        const error = await handleAddProductToCurrentWeekShoppingList(product)

        const errorFormatted = {
          error: error.values ?? 'Error',
          values: product,
        }
        onSuccess(
          error.action ? 'update' : 'create',
          error.values ? errorFormatted : undefined
        )
      })
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors)
      }
    }
  }

  return {
    errors,
    hasErrors,
    pending,
    handleChange,
    handleSubmitProductToShoppingList,
  }
}
