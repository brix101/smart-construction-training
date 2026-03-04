import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { clerkClient } from '@/server/common/clerk'
import { getAuth } from '@/server/common/get-auth'
import { db } from '@/server/db'

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  try {
    console.log('[createContext]', opts.req)
    const user = await getAuth(opts.req)

    return {
      session: { user },
      clerkClient,
      db,
    }
  } catch (error) {
    console.error('[createContext]', error)
    return { session: null, db, clerkClient }
  }
}

export type TRPCContext = Awaited<ReturnType<typeof createContext>>
