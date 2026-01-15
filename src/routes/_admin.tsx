import { Protect, useAuth, UserButton } from '@clerk/clerk-react'
import { createFileRoute, Outlet } from '@tanstack/react-router'

import { DashboardSideBar } from '@/components/dashboard-sidebar'
import { ThemeToggle } from '@/components/theme-provider'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { usePermissions } from '@/hooks/use-permissions'

export const Route = createFileRoute('/_admin')({
  component: RouteComponent,
})

function RouteComponent() {
  const { has } = usePermissions()

  return (
    <Protect
      condition={() => has('org:sys_memberships:manage')}
      fallback={
        <p>Only an Admin or Billing Manager can access this content.</p>
      }
    >
      <SidebarProvider>
        <DashboardSideBar />

        <SidebarInset>
          <main className="flex flex-col">
            <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <h1>Smart Construction Training</h1>
              </div>
              <div className="flex items-center gap-2 px-4">
                <ThemeToggle />
                <UserButton />
              </div>
            </header>
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </Protect>
  )
}
