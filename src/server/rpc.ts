import * as RpcSerialization from "@effect/rpc/RpcSerialization"
import * as RpcServer from "@effect/rpc/RpcServer"
import * as Layer from "effect/Layer"

import { DomainRpc } from "~/server/domain"

import * as Auth from "./auth"
import {
  AuthMiddleware,
  AuthMiddlewareLive,
  RpcLogger,
  RpcLoggerLive,
} from "./middleware"
import { CategoryRpcLive } from "./modules/categories/category.rpc"
import { HelloRpcLive } from "./services"

const rpcGroups = Layer.mergeAll(HelloRpcLive, CategoryRpcLive)

export const RpcRouter = RpcServer.layerHttpRouter({
  group: DomainRpc.middleware(RpcLogger).middleware(AuthMiddleware),
  path: "/api/rpc",
  protocol: "http",
  spanPrefix: "rpc",
  disableFatalDefects: true,
}).pipe(
  Layer.provide(rpcGroups),
  Layer.provide(RpcLoggerLive),
  Layer.provide(AuthMiddlewareLive),
  Layer.provide(Auth.fromDefault),
  Layer.provide(RpcSerialization.layerNdjson)
)
