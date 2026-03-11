import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"

import { auth } from "./config"

export const getSessionFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders()

    return auth.api.getSession({ headers })
  }
)

export const getHeaders = createServerFn({ method: "GET" }).handler(
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return getRequestHeaders()
  }
)
