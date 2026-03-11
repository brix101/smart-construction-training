import * as Rpc from "@effect/rpc"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Schema from "effect/Schema"

import { CurrentUser, Unauthorized } from "~/server/middleware"

import {
  Category,
  CategoryId,
  CategoryNotFound,
  LobbyCategory,
} from "./category.schema"
import { CategoryService } from "./category.service"

export class CategoryRpc extends Rpc.RpcGroup.make(
  Rpc.Rpc.make("GetAll", {
    success: Schema.Array(LobbyCategory),
    error: Unauthorized,
  }),

  Rpc.Rpc.make("GetById", {
    success: Category,
    error: Schema.Union(CategoryNotFound, Unauthorized),
    payload: { id: CategoryId },
  })
).prefix("Category_") {}

export const CategoryRpcLive = CategoryRpc.toLayer(
  Effect.gen(function* () {
    const service = yield* CategoryService

    return {
      Category_GetAll: () =>
        CurrentUser.pipe(
          Effect.flatMap(() => {
            return service.getAll
          })
        ),

      Category_GetById: ({ id }) =>
        CurrentUser.pipe(
          Effect.flatMap(() => {
            return service.getById(id)
          })
        ),
    }
  })
).pipe(Layer.provide(CategoryService.Default))
