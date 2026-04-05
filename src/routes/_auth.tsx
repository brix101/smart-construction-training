import { createFileRoute, Outlet } from '@tanstack/react-router'

import { Shell } from '@/components/shell'

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Shell className="max-w-lg">
      <Outlet />
    </Shell>
  )
}
