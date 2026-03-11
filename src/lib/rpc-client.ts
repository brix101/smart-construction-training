import * as FetchHttpClient from "@effect/platform/FetchHttpClient"
import * as RpcClient from "@effect/rpc/RpcClient"
import * as RpcSerialization from "@effect/rpc/RpcSerialization"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Predicate from "effect/Predicate"
import * as Stream from "effect/Stream"

import { DomainRpc } from "~/server/domain"

export const addRpcErrorLogging = <TArg>(client: TArg): TArg => {
  const isStream = (
    u: unknown
  ): u is Stream.Stream<unknown, unknown, unknown> =>
    Predicate.hasProperty(u, Stream.StreamTypeId)

  const wrapCall = <TFn extends (...args: Array<any>) => any>(
    fn: TFn,
    path: ReadonlyArray<string>
  ): TFn => {
    const rpcId = path.join(".")
    const logCause = (cause: unknown) =>
      Effect.logError(`[API] ${rpcId} failed`, cause)

    return function (
      this: ThisParameterType<TFn>,
      ...args: Parameters<TFn>
    ): ReturnType<TFn> {
      const result = fn.apply(this, args)
      if (Effect.isEffect(result)) {
        return result.pipe(Effect.tapErrorCause(logCause)) as ReturnType<TFn>
      }
      if (isStream(result)) {
        return result.pipe(Stream.tapErrorCause(logCause)) as ReturnType<TFn>
      }
      return result
    } as TFn
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

  return visit(client, []) as TArg
}

const getBaseUrl = (): string =>
  typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3000"

const ProtocolLive = RpcClient.layerProtocolHttp({
  url: getBaseUrl() + "/api/rpc",
}).pipe(Layer.provide([FetchHttpClient.layer, RpcSerialization.layerNdjson]))

export class RpcProtocolClient extends Effect.Service<RpcProtocolClient>()(
  "lib/RpcProtocolClient",
  {
    dependencies: [ProtocolLive, FetchHttpClient.layer],
    scoped: Effect.gen(function* () {
      const rpcClient = yield* RpcClient.make(DomainRpc, {})
      return addRpcErrorLogging(rpcClient)
    }),
  }
) {}
