import { categoryRouter } from '@/server/routes/categories'
import { coursesRouter } from '@/server/routes/courses'
import { topicsRouter } from '@/server/routes/topics'

import { createTRPCRouter } from '../trpc'

export const appRouter = createTRPCRouter({
  categories: categoryRouter,
  courses: coursesRouter,
  topics: topicsRouter,
})
export type AppRouter = typeof appRouter
