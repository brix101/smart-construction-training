import { Rpc, RpcGroup } from "@effect/rpc"
import { CurrentUser } from "#/server/middleware"
import { Effect, Layer, Schema } from "effect"

import {
  Category,
  CategoryId,
  CategoryNotFound,
  LobbyCategory,
} from "./category.schema"
import { CategoryService } from "./category.service"

export class CategoryRpc extends RpcGroup.make(
  Rpc.make("getAll", {
    success: Schema.Array(LobbyCategory),
  }),

  Rpc.make("getById", {
    success: Category,
    error: CategoryNotFound,
    payload: { id: CategoryId },
  })
).prefix("category_") {}

export const CategoryRpcLive = CategoryRpc.toLayer(
  Effect.gen(function* () {
    const service = yield* CategoryService

    return {
      category_getAll: () =>
        CurrentUser.pipe(
          Effect.flatMap(() => {
            return service.getAll
          })
        ),

      category_getById: ({ id }) =>
        CurrentUser.pipe(
          Effect.flatMap(() => {
            return service.getById(id)
          })
        ),
    }
  })
).pipe(Layer.provide(CategoryService.Default))
