import { TRPCRouterRecord } from '@trpc/server'

import { searchParamsSchema } from '@/schema/search'

import { protectedProcedure } from '../trpc'

export const usersRouter = {
  list: protectedProcedure
    .input(searchParamsSchema)
    .query(async ({ ctx, input: { page, limit, query } }) => {
      const offset = page > 0 ? (page - 1) * limit : 0

      try {
        const result = await ctx.clerkClient?.users.getUserList({
          limit,
          offset,
          query,
        })

        const items = result?.data ?? []
        const count = result?.totalCount ?? 0

        return {
          items,
          count,
          pageCount: Math.ceil(count / limit),
        }
      } catch (error) {
        console.error('[usersRouter.list]', error)
        return {
          items: [],
          count: 0,
          pageCount: 0,
        }
      }
    }),
} satisfies TRPCRouterRecord
