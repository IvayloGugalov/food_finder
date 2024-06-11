'use client'

import type { MouseEventHandler } from 'react'
import { Button } from '@/components/ui/button'
import Icon from '../ui/icon'

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
      disabled={disabled}
      aria-disabled={disabled}
      onClick={onClick}
      className='w-full text-white'
    >
      {`Add${disabled ? 'ing' : ''}`} to&nbsp;
      <Icon icon='shopping-cart' size='24' color='white' />
      {`${disabled ? '...' : ''}`}
    </Button>
  )
}
