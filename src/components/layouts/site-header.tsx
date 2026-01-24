import {
  Protect,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/clerk-react'
import { LayoutDashboardIcon, Users } from 'lucide-react'

import { ThemeToggle } from '@/components/theme-provider'
import { usePermissions } from '@/hooks/use-permissions'
import { siteConfig } from '@/lib/config'

import { MainNav } from './main-nav'

export function SiteHeader() {
  const { has } = usePermissions()

  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6 lg:px-8">
        <MainNav items={siteConfig.mainNav} />
        {/* <MobileNav sidebarNavItems={navItems} /> */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {/* <TopicCommandMenu /> */}
            <ThemeToggle />
            <SignedIn>
              <Protect
                condition={() => has('org:sys_memberships:manage')}
                fallback={<UserButton />}
              >
                <UserButton>
                  <UserButton.MenuItems>
                    <UserButton.Link
                      label="Dashboard"
                      labelIcon={<LayoutDashboardIcon className="h-4 w-4" />}
                      href="/dashboard/courses"
                    />
                    <UserButton.Link
                      label="Users"
                      labelIcon={<Users className="h-4 w-4" />}
                      href="/dashboard/users"
                    />
                  </UserButton.MenuItems>
                </UserButton>
              </Protect>
            </SignedIn>
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </nav>
        </div>
      </div>
    </header>
  )
}
