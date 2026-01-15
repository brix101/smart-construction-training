import { jwtDecode } from 'jwt-decode'

import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { db } from '@/server/db'
import { SessionJwtPayload } from '@/types/session'

import { clerkClient } from '../common/clerk'

function getCookies(cookieHeader: string) {
  return Object.fromEntries(
    cookieHeader.split('; ').map((c) => {
      const [k, ...v] = c.split('=')
      return [k, decodeURIComponent(v.join('='))]
    }),
  )
}

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  try {
    const cookieHeader = opts.req.headers.get('cookie') ?? ''
    const token = getCookies(cookieHeader)['__session']

    if (!token) {
      return { session: null, db }
    }

    let decoded: SessionJwtPayload

    try {
      decoded = jwtDecode<SessionJwtPayload>(token)
    } catch {
      return { session: null, db }
    }

    if (!decoded.sub) {
      return { session: null, db }
    }

    const user = await clerkClient.users.getUser(decoded.sub)

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
