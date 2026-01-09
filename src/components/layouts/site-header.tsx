import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from '@clerk/clerk-react'
import { LayoutDashboardIcon, Users } from 'lucide-react'

import { ModeToggle } from '@/components/mode-toggle'
import { siteConfig } from '@/config/site'

import { MainNav } from './main-nav'

export function SiteHeader() {
  const { user } = useUser()
  const isAdmin = user?.publicMetadata?.role === 'admin'

  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b">
      <div className="container mx-auto flex h-16 items-center">
        <MainNav items={siteConfig.mainNav} />
        {/* <MobileNav sidebarNavItems={navItems} /> */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {/* <TopicCommandMenu /> */}
            <ModeToggle />
            <SignedIn>
              <UserButton>
                {isAdmin && (
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
                )}
              </UserButton>
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
