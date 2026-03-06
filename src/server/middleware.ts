import type { User } from "better-auth"
import { HttpApiSchema } from "@effect/platform"
import * as RpcMiddleware from "@effect/rpc/RpcMiddleware"
import { Context, Predicate, Schema } from "effect"
import * as Effect from "effect/Effect"
import * as Exit from "effect/Exit"
import * as Layer from "effect/Layer"

import { Auth } from "./auth"

export class RpcLogger extends RpcMiddleware.Tag<RpcLogger>()("RpcLogger", {
  wrap: true,
  optional: true,
}) {}

export const RpcLoggerLive = Layer.succeed(
  RpcLogger,
  RpcLogger.of((opts) =>
    Effect.flatMap(Effect.exit(opts.next), (exit) =>
      Exit.match(exit, {
        onSuccess: () => exit,
        onFailure: (cause) =>
          Effect.zipRight(
            Effect.annotateLogs(
              Effect.logError(`RPC request failed: ${opts.rpc._tag}`, cause),
              {
                "rpc.method": opts.rpc._tag,
                "rpc.clientId": opts.clientId,
              }
            ),
            exit
          ),
      })
    )
  )
)

export class CurrentUser extends Context.Tag("CurrentUser")<
  CurrentUser,
  User
>() {}

export class Unauthorized extends Schema.TaggedError<Unauthorized>()(
  "Unauthorized",
  {
    actorId: Schema.String, // (Assuming UserId is a string/branded string)
    entity: Schema.String,
    action: Schema.String,
    // 1. Add your custom application code here!
    code: Schema.Literal("MISSING_ROLE", "ACCOUNT_SUSPENDED", "TRIAL_EXPIRED"),
  },
  // This still correctly sets the HTTP transport status to 403
  HttpApiSchema.annotations({ status: 403 })
) {
  get message() {
    return `Actor (${this.actorId}) is not authorized to perform action "${this.action}" on entity "${this.entity}". Reason: ${this.code}`
  }

  static is(u: unknown): u is Unauthorized {
    return Predicate.isTagged(u, "Unauthorized")
  }

  // 2. Update your refail helper to accept the code
  static refail(
    entity: string,
    action: string,
    code:
      | "MISSING_ROLE"
      | "ACCOUNT_SUSPENDED"
      | "TRIAL_EXPIRED" = "MISSING_ROLE"
  ) {
    return <A, E, R>(
      effect: Effect.Effect<A, E, R>
    ): Effect.Effect<A, E | Unauthorized, CurrentUser | R> =>
      Effect.catchAll(effect, (e) => {
        if (Unauthorized.is(e)) return Effect.fail(e)

        return Effect.flatMap(CurrentUser, (actor) =>
          Effect.fail(
            new Unauthorized({ actorId: actor.id, entity, action, code })
          )
        )
      })
  }
}

export class AuthMiddleware extends RpcMiddleware.Tag<AuthMiddleware>()(
  "AuthMiddleware",
  {
    provides: CurrentUser,
    requiredForClient: true,
    failure: Unauthorized,
    wrap: true,
  }
) {}

export const AuthMiddlewareLive = Layer.effect(
  AuthMiddleware,
  Effect.gen(function* () {
    const auth = yield* Auth

    return AuthMiddleware.of((opts) =>
      Effect.gen(function* () {
        const session = yield* auth.getSession.pipe(
          Effect.flatMap((session) =>
            session
              ? Effect.succeed(session)
              : Effect.fail(
                  new Unauthorized({
                    actorId: "unknown",
                    entity: "session",
                    action: "get",
                    code: "MISSING_ROLE",
                  })
                )
          )
        )

        return yield* Effect.provideService(
          opts.next,
          CurrentUser,
          session.user
        )
      })
    )
  })
)
