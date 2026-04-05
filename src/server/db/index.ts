import { drizzle } from 'drizzle-orm/node-postgres'

import * as schema from './schema.ts'
import { env } from '@/env.ts'


export const db = drizzle(env.DATABASE_URL, {
  schema,
  logger: env.NODE_ENV !== 'production',
  casing: 'snake_case',
})
