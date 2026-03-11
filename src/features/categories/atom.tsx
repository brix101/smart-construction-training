import type * as Data from "effect/Data"
import { Atom, Result } from "@effect-atom/atom"
import { serializable } from "@effect-atom/atom/Atom"
import { RpcClientError } from "@effect/rpc/RpcClientError"
import * as Array from "effect/Array"
import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import * as Schema from "effect/Schema"

import { RpcProtocolClient } from "~/lib/rpc-client"
import { Unauthorized } from "~/server/middleware"
import {
  CategoryId,
  LobbyCategory,
} from "~/server/modules/categories/category.schema"

class CategoryRpc extends Effect.Service<CategoryRpc>()(
  "@features/categories",
  {
    effect: Effect.gen(function* () {
      const rpc = yield* RpcProtocolClient

      return {
        getAll: rpc.Category_GetAll,
        getById: rpc.Category_GetById,
      } as const
    }),
    dependencies: [RpcProtocolClient.Default],
  }
) {}

export const runtime = Atom.runtime(CategoryRpc.Default)

type CategoryCacheUpdate = Data.TaggedEnum<{
  Upsert: { readonly category: LobbyCategory }
  Delete: { readonly id: CategoryId }
}>

export const categoriesAtom = (() => {
  const remote = runtime
    .atom(
      Effect.gen(function* () {
        const rpc = yield* CategoryRpc
        const result = yield* rpc.getAll()
        return result
      })
    )
    .pipe(
      serializable({
        key: "@features/categories/categoriesAtom",
        schema: Result.Schema({
          success: Schema.Array(LobbyCategory),
          error: Schema.Union(Unauthorized, RpcClientError),
        }),
      })
    )

  const atom = Atom.writable(
    (get) => get(remote),
    (ctx, update: CategoryCacheUpdate) => {
      const current = ctx.get(remote)
      if (!Result.isSuccess(current)) return

      const nextValue = (() => {
        switch (update._tag) {
          case "Upsert": {
            const existingIndex = Array.findFirstIndex(
              current.value,
              (t) => t.id === update.category.id
            )
            return Option.match(existingIndex, {
              onNone: () => Array.prepend(current.value, update.category),
              onSome: (index) =>
                Array.replace(current.value, index, update.category),
            })
          }
          case "Delete": {
            return Array.filter(current.value, (t) => t.id !== update.id)
          }
        }
      })()

      ctx.setSelf(Result.success(nextValue))
    },
    (refresh) => {
      refresh(remote)
    }
  )

  return Object.assign(atom, { remote })
})()

export const getCategoryByIdAtom = runtime.fn<{ id: string }>()(
  Effect.fnUntraced(function* (input) {
    const rpc = yield* CategoryRpc
    const result = yield* rpc.getById({ id: CategoryId.make(input.id) })
    return result
  })
)

export const getCategoryAtom = (id: string) => {
  const remote = runtime.atom(
    Effect.gen(function* () {
      const rpc = yield* CategoryRpc
      return yield* rpc.getById({ id: CategoryId.make(id) })
    })
  )

  const atom = Atom.writable(
    (get) => get(remote),
    (_ctx, _update) => {
      // ctx.setSelf(Result.success())
    }
    // (refresh) => refresh(remote)
  )

  return Object.assign(atom, { remote })
}
