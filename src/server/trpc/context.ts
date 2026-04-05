import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { auth } from '@clerk/tanstack-react-start/server'

import { clerkClient } from '@/server/common/clerk'
import { db } from '@/server/db'

export const createContext = async (_opts: FetchCreateContextFnOptions) => {
  try {
    const session = await auth()

    return {
      session,
      clerkClient,
      db,
    }
  } catch (error) {
    console.error('[createContext]', error)
    return { session: null, db, clerkClient }
  }
}

export type TRPCContext = Awaited<ReturnType<typeof createContext>>
