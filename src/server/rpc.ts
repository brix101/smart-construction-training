import * as RpcSerialization from "@effect/rpc/RpcSerialization"
import * as RpcServer from "@effect/rpc/RpcServer"
import { DomainRpc } from "#/server/domain"
import * as Layer from "effect/Layer"

import * as Auth from "./auth"
import {
  AuthMiddleware,
  AuthMiddlewareLive,
  RpcLogger,
  RpcLoggerLive,
} from "./middleware"
import { HelloRpcLive } from "./services"

export const RpcRouter = RpcServer.layerHttpRouter({
  group: DomainRpc.middleware(RpcLogger).middleware(AuthMiddleware),
  path: "/api/rpc",
  protocol: "http",
  spanPrefix: "rpc",
  disableFatalDefects: true,
}).pipe(
  Layer.provide(HelloRpcLive),
  Layer.provide(RpcLoggerLive),
  Layer.provide(AuthMiddlewareLive),
  Layer.provide(Auth.fromDefault),
  Layer.provide(RpcSerialization.layerNdjson)
)
