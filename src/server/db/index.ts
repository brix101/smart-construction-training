import { DatabaseError as NeonDbError, Pool } from "@neondatabase/serverless"
import * as authSchema from "#/server/db/schema/auth-schema"
import * as schema from "#/server/db/schema/schema"
import { drizzle } from "drizzle-orm/neon-serverless"
import { Config, Context, Data, Effect, Layer, Redacted } from "effect"

import type { PoolConfig } from "@neondatabase/serverless"

const allSchemas = {
  ...authSchema,
  ...schema,
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
})

export const db = drizzle(pool, {
  schema: allSchemas,
  casing: "snake_case",
})

export class DatabaseConnectionLostError extends Data.TaggedError(
  "DatabaseConnectionLostError"
)<{
  cause: unknown
  message: string
}> {}

export class DatabaseError extends Data.TaggedError("DatabaseError")<{
  readonly type:
    | "unique_violation"
    | "foreign_key_violation"
    | "connection_error"
  readonly cause: NeonDbError
}> {
  public override toString() {
    return `DatabaseError: ${this.cause.message}`
  }

  public get message() {
    return this.cause.message
  }
}

type DatabaseShape = {
  use: <T>(
    fn: (
      client: ReturnType<typeof drizzle<typeof allSchemas, Pool>>
    ) => Promise<T>
  ) => Effect.Effect<T, DatabaseError, never>
}

export class Database extends Context.Tag("Database")<
  Database,
  DatabaseShape
>() {}

const make = (config?: PoolConfig) =>
  Effect.gen(function* () {
    const pool = yield* Effect.acquireRelease(
      Effect.sync(() => new Pool(config)),
      (pool) => Effect.promise(() => pool.end())
    )

    yield* Effect.tryPromise(() => pool.query("SELECT 1")).pipe(
      Effect.timeoutFail({
        duration: "10 seconds",
        onTimeout: () =>
          new DatabaseConnectionLostError({
            cause: new Error("[Database] Failed to connect: timeout"),
            message: "[Database] Failed to connect: timeout",
          }),
      }),
      Effect.catchTag(
        "UnknownException",
        (error) =>
          new DatabaseConnectionLostError({
            cause: error.cause,
            message: "[Database] Failed to connect",
          })
      ),
      Effect.tap(() =>
        Effect.logInfo("[Database Client]: Connection to database established.")
      )
    )

    const db = drizzle(pool, {
      schema: allSchemas,
      casing: "snake_case",
    })

    return Database.of({
      use: Effect.fn("Database.use")((fn) =>
        Effect.tryPromise({
          try: () => fn(db),
          catch: (error) => {
            if (error instanceof NeonDbError) {
              switch (error.code) {
                case "23505":
                  throw new DatabaseError({
                    type: "unique_violation",
                    cause: error,
                  })
                case "23503":
                  throw new DatabaseError({
                    type: "foreign_key_violation",
                    cause: error,
                  })
                case "08000":
                  throw new DatabaseError({
                    type: "connection_error",
                    cause: error,
                  })
              }
            }
            throw error
          },
        })
      ),
    })
  })

export const layer = (config?: PoolConfig) =>
  Layer.scoped(Database, make(config))

export const fromEnv = Layer.scoped(
  Database,
  Effect.gen(function* () {
    const url = yield* Config.redacted("DATABASE_URL")
    return yield* make({ connectionString: Redacted.value(url) })
  })
)
