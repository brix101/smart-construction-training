import type { SessionAuthObject } from '@clerk/backend'
import { createClerkClient } from '@clerk/backend'
import { z } from 'zod'

import { env } from '@/env'

export const RoleEnum = z.enum(['admin', 'editor', 'user'])
export type Role = z.infer<typeof RoleEnum>

export const SessionMetadataSchema = z.object({
  role: RoleEnum.default('user'),
  level: z.number().default(0),
})

export type SessionMetadata = z.infer<typeof SessionMetadataSchema>

export const getMetadata = (session: SessionAuthObject) => {
  return SessionMetadataSchema.parse(session.sessionClaims?.metadata ?? {})
}

export const hasRole = (session: SessionAuthObject, role: Role): boolean => {
  return getMetadata(session).role === role
}

export const hasLevel = (
  session: SessionAuthObject,
  level: number,
): boolean => {
  return getMetadata(session).level >= level
}

export const clerkClient = createClerkClient({
  secretKey: env.CLERK_SECRET_KEY,
})
