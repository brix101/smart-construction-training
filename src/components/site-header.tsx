import { ThemeToggle } from "~/components/theme-provider"

import { MainNav } from "./main-nav"

export function SiteHeader() {
  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6 lg:px-8">
        <MainNav />
        {/* <MobileNav sidebarNavItems={navItems} /> */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {/* <TopicCommandMenu /> */}
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
