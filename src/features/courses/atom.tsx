import { Atom } from "@effect-atom/atom"
import { EffectRpcClient } from "#/lib/rpc-client"
import { Effect } from "effect"

class CourseRpc extends Effect.Service<CourseRpc>()("@features/courses", {
  effect: Effect.gen(function* () {
    const rpc = yield* EffectRpcClient

    return {
      //   getAll: () => rpc.category_getAll(),
      //   getById: (id: CourseId) => rpc.category_getById({ id }),
    } as const
  }),
  dependencies: [EffectRpcClient.Default],
}) {}

export const runtime = Atom.runtime(CourseRpc.Default)

// type CourseCacheUpdate = Data.TaggedEnum<{
//   Upsert: { readonly course: LobbyCourse }
//   Delete: { readonly id: CourseId }
// }>
