import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"

import { HelloRpc } from "./domain"
import { CurrentUser } from "./middleware"
import { HelloService } from "./repository"

export const HelloRpcLive = HelloRpc.toLayer(
  Effect.gen(function* () {
    const service = yield* HelloService

    return {
      hello_greet: ({ name }) =>
        CurrentUser.pipe(
          Effect.flatMap((user) => {
            console.log("Current user:", user)
            return service.hello(name ?? user.name)
          })
        ),
    }
  })
).pipe(Layer.provide(HelloService.Default))
