import { Atom } from "@effect-atom/atom"
import * as Effect from "effect/Effect"

import { RpcProtocolClient } from "~/lib/rpc-client"

class CourseRpc extends Effect.Service<CourseRpc>()("@features/courses", {
  effect: Effect.gen(function* () {
    const rpc = yield* RpcProtocolClient

    return {
      //   getAll: () => rpc.category_getAll(),
      //   getById: (id: CourseId) => rpc.category_getById({ id }),
    } as const
  }),
  dependencies: [RpcProtocolClient.Default],
}) {}

export const runtime = Atom.runtime(CourseRpc.Default)

// type CourseCacheUpdate = Data.TaggedEnum<{
//   Upsert: { readonly course: LobbyCourse }
//   Delete: { readonly id: CourseId }
// }>
