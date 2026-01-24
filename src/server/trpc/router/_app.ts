import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

import { categoryRouter } from '@/server/trpc/router/categories'
import { coursesRouter } from '@/server/trpc/router/courses'
import { topicsRouter } from '@/server/trpc/router/topics'
import { usersRouter } from '@/server/trpc/router/users'
import { createTRPCRouter } from '@/server/trpc/trpc'

export const appRouter = createTRPCRouter({
  categories: categoryRouter,
  courses: coursesRouter,
  topics: topicsRouter,
  users: usersRouter,
})

export type AppRouter = typeof appRouter

export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>
