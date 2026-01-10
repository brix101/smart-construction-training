import { categoryRouter } from '@/server/trpc/router/categories'
import { coursesRouter } from '@/server/trpc/router/courses'
import { topicsRouter } from '@/server/trpc/router/topics'

import { createTRPCRouter } from '../trpc'

export const appRouter = createTRPCRouter({
  categories: categoryRouter,
  courses: coursesRouter,
  topics: topicsRouter,
})
export type AppRouter = typeof appRouter
