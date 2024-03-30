'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'

import { AlignRight } from 'lucide-react'
import { defaultLinks } from '@/config/nav'
import Icon from './ui/icon'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div>
      <div className='flex border-b mb-4 pb-2 w-full justify-end'>
        <Button variant={'link'} onClick={() => router.push('/shopping-lists')}>
          <Icon icon='shopping-cart' className={'hover:scale-110 transition-transform duration-300'} />
        </Button>
      </div>

      <div className='md:hidden border-b mb-4 pb-2 w-full'>
        <nav className='flex justify-between w-full items-center'>
          <div className='font-semibold text-lg'>Logo</div>
          <Button variant='ghost' onClick={() => setOpen(!open)}>
            <AlignRight />
          </Button>
        </nav>
        {open ? (
          <div className='my-4 p-4 bg-muted'>
            <ul className='space-y-2'>
              {defaultLinks.map((link) => (
                <li key={link.title} onClick={() => setOpen(false)} className=''>
                  <Link
                    href={link.href}
                    className={
                      pathname === link.href
                        ? 'text-primary hover:text-primary font-semibold'
                        : 'text-muted-foreground hover:text-primary'
                    }
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        div
      </div>
    </div>
  )
}
