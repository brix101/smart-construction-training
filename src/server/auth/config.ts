import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { tanstackStartCookies } from "better-auth/tanstack-start"
import * as Effect from "effect/Effect"

import { db } from "../db"
import * as Database from "../db"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [tanstackStartCookies()],
})

export class AuthClient extends Effect.Service<AuthClient>()(
  "auth/AuthClient",
  {
    dependencies: [Database.fromEnv],
    effect: Effect.gen(function* () {
      const { client } = yield* Database.Database

      const bAuth = betterAuth({
        database: drizzleAdapter(client, { provider: "pg" }),
        emailAndPassword: {
          enabled: true,
        },
        plugins: [tanstackStartCookies()],
      })

      return bAuth
    }),
  }
) {}
