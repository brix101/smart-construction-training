import * as Rpc from "@effect/rpc/Rpc"
import * as RpcGroup from "@effect/rpc/RpcGroup"
import * as Schema from "effect/Schema"

import { CategoryRpc } from "./modules/categories/category.rpc"

export class HelloRpc extends RpcGroup.make(
  Rpc.make("greet", {
    success: Schema.NonEmptyString,
    payload: { name: Schema.UndefinedOr(Schema.NonEmptyString) },
  })
).prefix("hello_") {}

export class DomainRpc extends RpcGroup.make()
  .merge(HelloRpc)
  .merge(CategoryRpc) {}
