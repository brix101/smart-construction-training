import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { db } from '@/server/db'

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  //TODO: Add auth logic here from clerk auth or migrate to betterauth
  return { auth: '', db: db }
}

export type TRPCContext = Awaited<ReturnType<typeof createContext>>
