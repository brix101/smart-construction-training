import type { Auth as BetterAuth } from "better-auth"
import { Context, Effect, Layer } from "effect"

import { auth } from "./config"
import { getSessionFn } from "./sesion"

type AuthShape = {
  use: <T>(
    fn: (api: BetterAuth["api"]) => Promise<T>
  ) => Effect.Effect<T, never, never>
  getSession: Effect.Effect<
    Awaited<ReturnType<typeof getSessionFn>>,
    never,
    never
  >
}

export class Auth extends Context.Tag("Auth")<Auth, AuthShape>() {}

const make = () =>
  Effect.gen(function* () {
    return Auth.of({
      use: Effect.fn("Auth.use")((fn) =>
        Effect.tryPromise({
          try: () => fn(auth.api),
          catch: (error) => {
            console.error("Auth error:", error)
            throw error
          },
        })
      ),
      getSession: Effect.tryPromise({
        try: () => getSessionFn(),
        catch: (error) => {
          console.error("Auth getSession error:", error)
          throw error
        },
      }),
    })
  })
const layer = () => Layer.scoped(Auth, make())

const fromDefault = Layer.scoped(
  Auth,
  Effect.gen(function* () {
    return yield* make()
  })
)

export { auth, fromDefault, layer }
