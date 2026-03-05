import * as HttpLayerRouter from "@effect/platform/HttpLayerRouter"
import * as HttpServerResponse from "@effect/platform/HttpServerResponse"
import { createFileRoute } from "@tanstack/react-router"
import { HelloService } from "#/server/repository"
import { RpcRouter } from "#/server/rpc"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Logger from "effect/Logger"
import * as ManagedRuntime from "effect/ManagedRuntime"

const HealthRoute = HttpLayerRouter.use((router) =>
  router.add("GET", "/api/rpc/health", HttpServerResponse.text("OK"))
)

const AllRoutes = Layer.mergeAll(RpcRouter, HealthRoute).pipe(
  Layer.provide(Logger.pretty)
)

const memoMap = Effect.runSync(Layer.makeMemoMap)

const globalHmr = globalThis as unknown as {
  __EFFECT_DISPOSE__?: () => Promise<void>
}
if (globalHmr.__EFFECT_DISPOSE__) {
  await globalHmr.__EFFECT_DISPOSE__()
  globalHmr.__EFFECT_DISPOSE__ = undefined
}

const { handler, dispose } = HttpLayerRouter.toWebHandler(AllRoutes, {
  memoMap,
})
const effectHandler = ({ request }: { request: Request }) => handler(request)

// ManagedRuntime for use in loaders/server functions
export const serverRuntime = ManagedRuntime.make(HelloService.Default, memoMap)

globalHmr.__EFFECT_DISPOSE__ = async () => {
  await dispose()
  await serverRuntime.dispose()
}

export const Route = createFileRoute("/api/rpc/$")({
  server: {
    handlers: {
      GET: effectHandler,
      POST: effectHandler,
      PUT: effectHandler,
      PATCH: effectHandler,
      DELETE: effectHandler,
      OPTIONS: effectHandler,
    },
  },
})
