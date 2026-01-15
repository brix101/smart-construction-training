import { categoryRouter } from '@/server/trpc/router/categories'
import { coursesRouter } from '@/server/trpc/router/courses'
import { topicsRouter } from '@/server/trpc/router/topics'
import { usersRouter } from '@/server/trpc/router/users'

import { createTRPCRouter } from '../trpc'

export const appRouter = createTRPCRouter({
  categories: categoryRouter,
  courses: coursesRouter,
  topics: topicsRouter,
  users: usersRouter,
})
export type AppRouter = typeof appRouter
