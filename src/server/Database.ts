import type { PoolConfig } from "pg";

import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import * as Config from "effect/Config";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Match from "effect/Match";
import * as Redacted from "effect/Redacted";
import pg from "pg";

import * as schema from "./db/schema";

export class DatabaseConnectionLostError extends Data.TaggedError("DatabaseConnectionLostError")<{
  cause: unknown;
  message: string;
}> {}

export class DatabaseError extends Data.TaggedError("DatabaseError")<{
  readonly type:
    | "unique_violation"
    | "foreign_key_violation"
    | "connection_error"
    | "unknown_error";
  readonly cause: unknown;
}> {
  public get message(): string {
    if (this.cause instanceof Error) {
      return this.cause.message;
    }

    if (this.cause && typeof this.cause === "object" && "message" in this.cause) {
      return String(this.cause.message);
    }

    return String(this.cause);
  }

  public override toString(): string {
    return `DatabaseError [${this.type}]: ${this.message}`;
  }
}

type Client = ReturnType<typeof drizzle<typeof schema, pg.Pool>>;

const handleDatabaseError = (error: unknown): DatabaseError =>
  Match.value(error).pipe(
    Match.when(
      (e: any) => e?.code === "23505" || e?.cause?.code === "23505",
      () => new DatabaseError({ type: "unique_violation", cause: error }),
    ),
    Match.when(
      (e: any) => e?.code === "23503" || e?.cause?.code === "23503",
      () => new DatabaseError({ type: "foreign_key_violation", cause: error }),
    ),
    Match.when(
      (e: any) => e?.code === "08000" || e?.cause?.code === "08000",
      () => new DatabaseError({ type: "connection_error", cause: error }),
    ),
    Match.orElse(() => new DatabaseError({ type: "unknown_error", cause: error })),
  );

export class Database extends Context.Service<Database>()("Database", {
  make: Effect.gen(function* () {
    const url = yield* Config.redacted("DATABASE_URL");

    const config: PoolConfig = {
      connectionString: Redacted.value(url),
    };

    const pool = yield* Effect.acquireRelease(
      Effect.sync(() => new pg.Pool(config)),
      (conn) => Effect.promise(() => conn.end()),
    );

    yield* Effect.tryPromise(() => pool.query("SELECT 1")).pipe(
      Effect.timeoutOrElse({
        duration: "10 seconds",
        orElse: () =>
          Effect.fail(
            new DatabaseConnectionLostError({
              cause: new Error("[Database] Failed to connect: timeout"),
              message: "[Database] Failed to connect: timeout",
            }),
          ),
      }),
      Effect.catchCause((cause) =>
        Effect.fail(
          new DatabaseConnectionLostError({
            cause,
            message: "[Database] Failed to connect",
          }),
        ),
      ),
      Effect.tap(() =>
        Effect.logInfo("[Database client]: Connection to the database established."),
      ),
    );

    const client = drizzle(pool, {
      schema,
      casing: "snake_case",
    });

    const use = Effect.fn("database.use")(function* <T>(fn: (client: Client) => Promise<T>) {
      return yield* Effect.tryPromise({
        try: () => fn(client),
        catch: handleDatabaseError,
      });
    });

    type Tx = Parameters<typeof client.transaction>[0] extends (tx: infer T) => any ? T : never;

    const withAudit = Effect.fn("database.withAudit")(function* <T>(
      userId: string,
      fn: (tx: Tx) => Promise<T>,
    ) {
      return yield* Effect.tryPromise({
        try: () =>
          client.transaction(async (tx) => {
            await tx.execute(sql`SELECT set_config('app.user_id', ${userId}, true)`);
            return fn(tx);
          }),
        catch: handleDatabaseError,
      });
    });

    return {
      client,
      use,
      withAudit,
    };
  }),
}) {
  static readonly layer = Layer.effect(this, this.make);
}
