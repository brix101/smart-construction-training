import { Protect } from '@clerk/clerk-react'
import { createFileRoute, Outlet } from '@tanstack/react-router'

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
      <Outlet />
    </Protect>
  )
}
