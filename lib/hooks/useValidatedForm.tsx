'use client'

import type { FormEvent} from 'react';
import { useState } from 'react'
import type { ZodSchema } from 'zod'

type EntityZodErrors<T> = Partial<Record<keyof T, string[] | undefined>>

export function useValidatedForm<Entity>(insertEntityZodSchema: ZodSchema) {
  const [errors, setErrors] = useState<EntityZodErrors<Entity> | null>(null)
  const hasErrors =
    errors !== null && Object.values(errors).some((error) => error !== undefined)

  const handleChange = (event: FormEvent<HTMLFormElement>) => {
    const target = event.target as EventTarget
    if ((
      target instanceof HTMLInputElement ||
      target instanceof HTMLSelectElement ||
      target instanceof HTMLTextAreaElement
    ) && !(target instanceof HTMLInputElement && target.type === 'submit')) {
        const field = target.name as keyof Entity
        const result = insertEntityZodSchema.safeParse({
          [field]: target.value,
        })
        const fieldError = result.success
          ? undefined
          : result.error.flatten().fieldErrors[field]

        setErrors((previous) => ({
          ...previous,
          [field]: fieldError,
        }))
      }
  }
  return { errors, setErrors, handleChange, hasErrors }
}
