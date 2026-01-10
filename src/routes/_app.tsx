import { createFileRoute, Outlet } from '@tanstack/react-router'

import { SiteHeader } from '@/components/layouts/site-header'

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="flex-1">
      <SiteHeader />
      <Outlet />
    </main>
  )
}
