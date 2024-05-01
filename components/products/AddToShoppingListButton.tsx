'use client'

import type { MouseEventHandler } from 'react'
import { Button } from '@/components/ui/button'

export const AddToShoppingListButton = ({
  disabled,
  onClick,
}: {
  disabled: boolean
  onClick: MouseEventHandler<HTMLButtonElement>
}) => {
  return (
    <Button
      type='submit'
      className='mr-2'
      disabled={disabled}
      aria-disabled={disabled}
      onClick={onClick}
    >
      {`Add${disabled ? 'ing' : ''}`} to shopping list{`${disabled ? '...' : ''}`}
    </Button>
  )
}
