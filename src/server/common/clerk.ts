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

export type PermissionString = {
  [K in keyof SessionMetadata]: `${K & string}:${SessionMetadata[K]}`
}[keyof SessionMetadata]

export const getMetadata = (session: SessionAuthObject) => {
  const meta = SessionMetadataSchema.parse(
    session.sessionClaims?.metadata ?? {},
  )
  return {
    metadata: meta,
    /**
     * Universal permission checker using a `key:value` string format.
     * * - **Enums/Strings (e.g., role):** Requires an exact match.
     * - **Numbers (e.g., level):** Acts as a minimum threshold (user level >= required level).
     * * @param permission - A strongly typed permission string (e.g., "role:admin", "level:3").
     * @returns `true` if the user meets the permission criteria, otherwise `false`.
     * * @example
     * const meta = getMetadata(session);
     * meta.has("role:admin"); // true if role is exactly 'admin'
     * meta.has("level:2");    // true if level is 2 or higher
     */
    has: (permission: PermissionString) => {
      const match = /^(\w+):(.+)$/.exec(permission)
      if (!match) return false

      const key = match[1] as keyof SessionMetadata
      const item = match[2]

      if (!(key in meta)) return false

      if (key === 'level') {
        const requiredLevel = Number(item)

        if (Number.isNaN(requiredLevel)) return false

        return meta.level >= requiredLevel
      }

      return String(meta[key]) === item
    },
  }
}

export const clerkClient = createClerkClient({
  secretKey: env.CLERK_SECRET_KEY,
})
