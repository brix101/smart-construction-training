import type { getRouter } from "./router";
import type { ServerContext } from "./server";

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
    server: { requestContext: ServerContext };
  }
}
