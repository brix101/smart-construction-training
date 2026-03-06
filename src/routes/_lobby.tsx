import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

import { Shell } from "#/components/shell"
import { SiteHeader } from "#/components/site-header"
import { getSessionFn } from "#/server/auth/sesion"

export const Route = createFileRoute("/_lobby")({
  beforeLoad: async () => {
    const session = await getSessionFn()

    if (!session) {
      throw redirect({ to: "/sign-in" })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="flex-1">
      <SiteHeader />
      <Shell>
        <Outlet />
      </Shell>
    </main>
  )
}
