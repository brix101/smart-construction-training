import { jwtDecode, JwtPayload } from 'jwt-decode'

import { clerkClient } from './clerk'

export type SessionJwtPayload = JwtPayload & {
  sub: string
  sid: string
}

function getCookies(cookieHeader: string) {
  return Object.fromEntries(
    cookieHeader.split('; ').map((c) => {
      const [k, ...v] = c.split('=')
      return [k, decodeURIComponent(v.join('='))]
    }),
  )
}

export async function getAuth(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') ?? ''
    const token = getCookies(cookieHeader)['__session']

    if (!token) {
      return null
    }

    let decoded: SessionJwtPayload

    try {
      decoded = jwtDecode<SessionJwtPayload>(token)
    } catch {
      return null
    }

    if (!decoded.sub) {
      return null
    }

    const user = await clerkClient.users.getUser(decoded.sub)

    return user
  } catch (error) {
    console.error('[getAuth]', error)
    return null
  }
}
