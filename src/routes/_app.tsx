import { SignIn, SignedIn, SignedOut } from '@clerk/clerk-react'
import { Outlet, createFileRoute } from '@tanstack/react-router'

import { SiteHeader } from '@/components/layouts/site-header'
import { Shell } from '@/components/shell'

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="flex-1">
      <SignedOut>
        <Shell className="max-w-lg">
          <SignIn />
        </Shell>
      </SignedOut>
      <SignedIn treatPendingAsSignedOut>
        <SiteHeader />
        <Shell>
          <Outlet />
        </Shell>
      </SignedIn>
    </main>
  )
}
