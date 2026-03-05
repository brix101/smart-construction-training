import * as Effect from "effect/Effect"

export class HelloService extends Effect.Service<HelloService>()(
  "HelloService",
  {
    effect: Effect.gen(function* () {
      const hello = (name?: string) =>
        Effect.gen(function* () {
          // yield* Effect.sleep("1 seconds")

          // const rand = Math.random()
          // if (rand < 0.2) {
          //   yield* Effect.logError(`Failed to say hello to ${name ?? "world"}`)
          //   throw new Error("Failed to say hello, please try again.")
          // }

          yield* Effect.logInfo(`Hello, ${name ?? "world"}!`)

          return `Hello, ${name ?? "world"}!`
        })

      return {
        hello,
      }
    }),
  }
) {}
