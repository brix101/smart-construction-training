import { TRPCError, TRPCRouterRecord } from '@trpc/server'

import { searchParamsSchema } from '@/schema/search'

import { protectedProcedure } from '../trpc'

type AllowedOrderBy =
  | '+created_at'
  | '-created_at'
  | '+last_sign_in_at'
  | '-last_sign_in_at'
let orderBy: AllowedOrderBy = '+created_at'

export const usersRouter = {
  list: protectedProcedure
    .input(searchParamsSchema)
    .query(async ({ ctx, input: { page, perPage: limit, query, sort } }) => {
      const offset = page > 0 ? (page - 1) * limit : 0

      try {
        switch (sort[0]?.id) {
          case 'createdAt':
            orderBy = sort[0].desc ? '-created_at' : '+created_at'
            break
          case 'lastSignInAt':
            orderBy = sort[0].desc ? '-last_sign_in_at' : '+last_sign_in_at'
            break
        }

        const result = await ctx.clerkClient?.users.getUserList({
          limit,
          offset,
          query,
          orderBy,
        })

        const items = result?.data ?? []
        const count = result?.totalCount ?? 0

        return {
          items,
          count,
          pageCount: Math.ceil(count / limit),
        }
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch users',
          cause: error,
        })
      }
    }),
} satisfies TRPCRouterRecord
