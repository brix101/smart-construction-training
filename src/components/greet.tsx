import React from "react"
import { Atom, Result } from "@effect-atom/atom"
import { useAtom } from "@effect-atom/atom-react"
import { RpcClientError } from "@effect/rpc/RpcClientError"
import { serializable } from "#/lib/atom-utils"
import { EffectRpcClient } from "#/lib/rpc-client"
import * as Data from "effect/Data"
import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"

import { Button } from "./ui/button"
import { Input } from "./ui/input"

class GreetRpc extends Effect.Service<GreetRpc>()("@app/index/GreetRpc", {
  dependencies: [EffectRpcClient.Default],
  effect: Effect.gen(function* () {
    const rpc = yield* EffectRpcClient

    return {
      initial: () => rpc.hello_greet({ name: undefined }),
      hello: (input: string) => rpc.hello_greet({ name: input }),
    } as const
  }),
}) {}

export const runtime = Atom.runtime(GreetRpc.Default)

type HelloCacheUpdate = Data.TaggedEnum<{
  Upsert: { readonly name: string }
  Delete: { readonly name: string }
}>

export const helloAtom = (() => {
  const remoteHello = runtime
    .atom(
      Effect.gen(function* () {
        const rpc = yield* GreetRpc
        const result = yield* rpc.initial()
        return result
      })
    )
    .pipe(
      serializable({
        key: "@app/index/helloAtom",
        schema: Result.Schema({
          success: Schema.NonEmptyString,
          error: RpcClientError,
        }),
      })
    )

  return Object.assign(
    Atom.writable(
      (get) => get(remoteHello),
      (ctx, update: HelloCacheUpdate) => {
        const current = ctx.get(helloAtom)
        if (!Result.isSuccess(current)) return

        const nextValue = (() => {
          switch (update._tag) {
            case "Upsert": {
              return `Hello, ${update.name}!`
            }
            case "Delete": {
              return "Hello, world!"
            }
          }
        })()

        ctx.setSelf(Result.success(nextValue))
      }
    ),
    { remote: remoteHello }
  )
})()

export const sayHelloAtom = runtime.fn<string>()(
  Effect.fnUntraced(function* (input, get) {
    const rpc = yield* GreetRpc
    const result = yield* rpc.hello(input)
    get.set(helloAtom, { _tag: "Upsert", name: input })
    return result
  })
)

export function Greet() {
  const [name, setName] = React.useState("")

  const [helloResult, sayHello] = useAtom(sayHelloAtom)

  const hasError = Result.isFailure(helloResult)
  const isSuccess = Result.isSuccess(helloResult)

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    if (!name.trim()) return

    sayHello(name)
  }

  React.useEffect(() => {
    if (isSuccess) {
      setName("")
    }
  }, [isSuccess])

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <Input
        name="name"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Button
        className="mt-4"
        type="submit"
        disabled={helloResult.waiting || !name.trim()}
      >
        {helloResult.waiting ? "Saying hello..." : "Say Hello"}
      </Button>
      {hasError && (
        <div className="mt-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          Failed to say hello. Please try again.
        </div>
      )}
    </form>
  )
}
