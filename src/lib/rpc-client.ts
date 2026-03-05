import { Headers } from "@effect/platform"
import * as FetchHttpClient from "@effect/platform/FetchHttpClient"
import { RpcMiddleware } from "@effect/rpc"
import * as RpcClient from "@effect/rpc/RpcClient"
import * as RpcSerialization from "@effect/rpc/RpcSerialization"
import { DomainRpc } from "#/server/domain"
import { AuthMiddleware } from "#/server/middleware"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import { hasProperty } from "effect/Predicate"
import * as Stream from "effect/Stream"

export const addRpcErrorLogging = <Client>(client: Client): Client => {
  const isStream = (
    u: unknown
  ): u is Stream.Stream<unknown, unknown, unknown> =>
    hasProperty(u, Stream.StreamTypeId)

  const wrapCall = <F extends (...args: Array<any>) => any>(
    fn: F,
    path: ReadonlyArray<string>
  ): F => {
    const rpcId = path.join(".")
    const logCause = (cause: unknown) =>
      Effect.logError(`[API] ${rpcId} failed`, cause)

    return function (
      this: ThisParameterType<F>,
      ...args: Parameters<F>
    ): ReturnType<F> {
      const result = fn.apply(this, args)
      if (Effect.isEffect(result)) {
        return result.pipe(Effect.tapErrorCause(logCause)) as ReturnType<F>
      }
      if (isStream(result)) {
        return result.pipe(Stream.tapErrorCause(logCause)) as ReturnType<F>
      }
      return result
    } as F
  }

  const visit = (node: unknown, path: ReadonlyArray<string>) => {
    if (node && typeof node === "object") {
      for (const [key, value] of Object.entries(node)) {
        const nextPath = [...path, key]
        if (typeof value === "function") {
          ;(node as Record<string, unknown>)[key] = wrapCall(value, nextPath)
          continue
        }
        visit(value, nextPath)
      }
    }
    return node
  }

  return visit(client, []) as Client
}

const getBaseUrl = (): string =>
  typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3000"

const RpcConfigLive = RpcClient.layerProtocolHttp({
  url: getBaseUrl() + "/api/rpc",
}).pipe(Layer.provide([FetchHttpClient.layer, RpcSerialization.layerNdjson]))

export class ApiClient extends Effect.Service<ApiClient>()("ApiClient", {
  dependencies: [RpcConfigLive, FetchHttpClient.layer],
  scoped: Effect.gen(function* () {
    const rpcClient = yield* RpcClient.make(DomainRpc, {})

    // const httpClient = yield* HttpApiClient.make(DomainApi, {
    //   baseUrl: getBaseUrl() + "/api",
    //   transformClient: (client) =>
    //     client.pipe(
    //       HttpClient.filterStatusOk,
    //       HttpClient.retryTransient({
    //         times: 3,
    //         schedule: Schedule.exponential("1 second"),
    //       }),
    //     ),
    // });

    return {
      rpc: addRpcErrorLogging(rpcClient),
      //   http: httpClient,
    }
  }),
}) {}

export const AuthClientLive = RpcMiddleware.layerClient(
  AuthMiddleware,
  ({ request, rpc }) => {
    console.log(request, rpc)

    return Effect.succeed({
      ...request,
      headers: Headers.set(request.headers, "authorization", "Bearer token"),
    })
  }
)

export class EffectRpcClient extends Effect.Service<EffectRpcClient>()(
  "EffectRpcClient",
  {
    dependencies: [AuthClientLive, RpcConfigLive, FetchHttpClient.layer],
    scoped: RpcClient.make(DomainRpc, {}),
  }
) {}
