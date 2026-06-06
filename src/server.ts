import { type auth } from "@clerk/tanstack-react-start/server";
import handler, { createServerEntry } from "@tanstack/react-start/server-entry";

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
  hello: string;
  foo: number;
}

export default createServerEntry({
  async fetch(request) {
    return handler.fetch(request, {
      context: {
        hello: "world",
        foo: 123,
      } as ServerContext,
    });
  },
});
