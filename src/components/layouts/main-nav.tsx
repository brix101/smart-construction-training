import { Link } from '@tanstack/react-router'

import type { MainNavItem } from '@/types'
import { Icons } from '@/components/icons'
import { siteConfig } from '@/lib/config'

interface MainNavProps {
  items?: MainNavItem[]
}

export function MainNav({ items }: MainNavProps) {
  return (
    <div className="hidden gap-6 lg:flex">
      <Link to="/" className="hidden items-center space-x-2 lg:flex">
        <Icons.logo className="h-6 w-6" aria-hidden="true" />
        <span className="hidden text-2xl font-bold lg:inline-block">
          {siteConfig.name}
        </span>
        <span className="sr-only">Home</span>
      </Link>
    </div>
  )
}
