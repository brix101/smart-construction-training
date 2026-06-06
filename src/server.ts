import { type auth } from "@clerk/tanstack-react-start/server";
import { isNotFound, isRedirect } from "@tanstack/react-router";
import handler, { createServerEntry } from "@tanstack/react-start/server-entry";
import * as Cause from "effect/Cause";
import * as Effect from "effect/Effect";
import * as Exit from "effect/Exit";
import * as Layer from "effect/Layer";

import { Database } from "./server/Database";
import { makeLoggerLayer } from "./server/LayerEx";

/**
 * Runs an Effect within the full app layer for HTTP request handlers (fetch,
 * server functions), converting failures to throwable values compatible with
 * TanStack Start's server function error serialization.
 *
 * Uses `runPromiseExit` instead of `runPromise` to inspect the `Exit` and
 * ensure the thrown value is always an `Error` instance (which TanStack Start
 * can serialize via seroval). Raw non-Error values from `Effect.fail` would
 * otherwise pass through `causeSquash` unboxed and fail the client-side
 * `instanceof Error` check, producing an opaque "unexpected error" message.
 *
 * TanStack `redirect`/`notFound` objects placed in the defect channel via
 * `Effect.die` are detected and re-thrown as-is so TanStack's control flow
 * (HTTP 307 redirects, 404 not-found handling) works from within Effect
 * pipelines.
 *
 * **Error message preservation:** TanStack Router's `ShallowErrorPlugin`
 * (seroval plugin used during SSR dehydration) serializes ONLY `.message`
 * from Error objects — `.name`, `._tag`, `.stack`, and all custom properties
 * are stripped. On the client it reconstructs `new Error(message)`. Effect v4
 * errors like `NoSuchElementError` set `.name` on the prototype and often
 * have `.message = undefined` (own property via `Object.assign`), so after
 * dehydration the client receives a bare `Error` with an empty message.
 * To ensure the error boundary always has something meaningful to display,
 * we normalize the thrown Error to always carry a non-empty `.message`,
 * using `Cause.pretty` which includes the error name and server-side stack
 * trace. This causes some duplication in the browser (the client-generated
 * `.stack` echoes `.message` in V8 environments) but preserves the full
 * server context that would otherwise be lost after `ShallowErrorPlugin`
 * strips everything except `.message`.
 */
const makeRunEffect = (env: Env) => {
  const runtimeLayer = Layer.merge(Database.layer, makeLoggerLayer(env));

  return async <TValue, TError>(
    effect: Effect.Effect<TValue, TError, Layer.Success<typeof runtimeLayer>>,
  ): Promise<TValue> => {
    const exit = await Effect.runPromiseExit(Effect.provide(effect, runtimeLayer));

    if (Exit.isSuccess(exit)) {
      return exit.value;
    }

    const squashed = Cause.squash(exit.cause);
    if (isRedirect(squashed) || isNotFound(squashed)) {
      throw squashed;
    }

    if (squashed instanceof Error) {
      if (Cause.isUnknownError(squashed) && squashed.cause instanceof Error) {
        squashed.message = squashed.cause.message;
      } else if (!squashed.message) {
        squashed.message = Cause.pretty(exit.cause);
      }

      throw squashed;
    }
    throw new Error(Cause.pretty(exit.cause));
  };
};

/**
 * Per-request context injected by `handler.fetch` and typed via Start's
 * `Register.server.requestContext`.
 *
 * Server functions consume this through `context` in handlers
 * (`createServerFn(...).handler(({ context }) => ...)`), so per-request
 * runtime data is available without importing
 * `@tanstack/react-start/server`.
 *
 * Why avoid that import in route modules: `@tanstack/react-start/server` is a
 * barrel that re-exports SSR stream/runtime modules, which pull Node builtins
 * (`node:stream`, `node:stream/web`, `node:async_hooks`) into the client build
 * graph and can trigger Rollup errors like:
 * `"Readable" is not exported by "__vite-browser-external"`.
 *
 * References:
 * - Import Protection (why imports can stay alive):
 *   https://tanstack.com/start/latest/docs/framework/react/guide/import-protection#common-pitfall-why-some-imports-stay-alive
 * - Server Entry Point request context (this pattern):
 *   https://tanstack.com/start/latest/docs/framework/react/guide/server-entry-point#request-context
 */
export interface ServerContext {
  auth: typeof auth;
  env: Env;
  runEffect: ReturnType<typeof makeRunEffect>;
}

export default createServerEntry({
  async fetch(request, env) {
    // console.log(`[${new Date().toISOString()}] fetch: ${request.url}`);

    const convertedEnv = env as unknown as Env;
    const runEffect = makeRunEffect(convertedEnv);

    return handler.fetch(request, { context: { env: convertedEnv, runEffect } as ServerContext });
  },
});
