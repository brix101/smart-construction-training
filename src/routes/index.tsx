import { Result, useAtomRefresh, useAtomValue } from "@effect-atom/atom-react"
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router"
import { Greet, helloAtom } from "#/components/greet"
import { Button } from "#/components/ui/button"
import { Spinner } from "#/components/ui/spinner"
import { authClient } from "#/lib/auth-client"
import { getSessionFn } from "#/server/auth/sesion"
import { Cause } from "effect"

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const session = await getSessionFn()

    if (!session) {
      throw redirect({ to: "/sign-in" })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const result = useAtomValue(helloAtom)
  const refetchHello = useAtomRefresh(helloAtom)

  const navigate = useNavigate()

  function handleSignOut() {
    authClient.signOut({
      fetchOptions: {
        onRequest: () => {
          navigate({ to: "/sign-in" })
        },
      },
    })
  }

  return (
    <main className="page-wrap px-4 pt-14 pb-8">
      <Button onClick={handleSignOut}>Sign Out</Button>
      {Result.builder(result)
        .onInitial(() => <Spinner />)
        .onSuccess((value) => (
          <h1 className="mb-4 text-2xl font-bold">{value}</h1>
        ))
        .onFailure((cause) => {
          const result = Cause.defects(cause)

          console.error("Failed to load data:", cause._tag)
          return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
              <p className="mb-2 text-red-700 dark:text-red-200">
                Failed to load data. Please try again.
              </p>
              <Button onClick={refetchHello} variant={"destructive"}>
                Retry
              </Button>
            </div>
          )
        })
        .render()}

      <Greet />
    </main>
  )
}
