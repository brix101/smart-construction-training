import type { Auth as BetterAuth } from "better-auth"
import * as Context from "effect/Context"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"

import { AuthClient, auth as authConfig } from "./config"
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
    const auth = yield* AuthClient

    return Auth.of({
      use: Effect.fn("Auth.use")((fn) =>
        Effect.tryPromise({
          try: () => fn(auth.api),
          catch: (error) => {
            console.error("[auth]", error)
            throw error
          },
        })
      ),
      getSession: Effect.tryPromise({
        try: () => getSessionFn(),
        catch: (error) => {
          console.error("[auth]", error)
          throw error
        },
      }),
    })
  })

const layer = () => Layer.scoped(Auth, make())

const fromDefault = Layer.scoped(Auth, make()).pipe(
  Layer.provide(AuthClient.Default)
)

export { authConfig as auth, fromDefault, layer }
