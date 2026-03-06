import { Link } from "@tanstack/react-router"

import { Icons } from "@/components/icons"
import { siteConfig } from "@/lib/config"

interface MainNavProps {}

export function MainNav({}: MainNavProps) {
  return (
    <div className="hidden gap-6 lg:flex">
      <Link to="/" className="hidden items-center space-x-2 lg:flex">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden text-2xl font-bold lg:inline-block">
          {siteConfig.name}
        </span>
        <span className="sr-only">Home</span>
      </Link>
    </div>
  )
}
