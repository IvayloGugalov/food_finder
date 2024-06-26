import { SidebarLink } from '@/components/SidebarItems'
import { Cog, Globe, HomeIcon } from 'lucide-react'

type AdditionalLinks = {
  title: string
  links: SidebarLink[]
}

export const defaultLinks: SidebarLink[] = [
  { href: '/dashboard', title: 'Home', icon: HomeIcon },
  { href: '/account', title: 'Account', icon: Cog },
  { href: '/settings', title: 'Settings', icon: Cog },
]

export const additionalLinks: AdditionalLinks[] = [
  {
    title: 'Entities',
    links: [
      {
        href: '/products',
        title: 'Products',
        icon: Globe,
      },
      {
        href: '/supermarkets',
        title: 'Supermarkets',
        icon: Globe,
      },
      {
        href: '/call-api',
        title: 'Generate all',
        icon: Globe,
      },
      {
        href: '/shopping-lists',
        title: 'Shopping lists',
        icon: Globe,
      },
      {
        href: '/shopping-products',
        title: 'Shopping products',
        icon: Globe,
      },
      {
        href: '/product-price-history',
        title: 'Price history',
        icon: Globe,
      },
    ],
  },
]
