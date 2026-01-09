import { TRPCRouterRecord } from '@trpc/server'
import { and, asc, countDistinct, eq } from 'drizzle-orm'
import z from 'zod'

import { categories, courseCategories } from '@/server/db/schema'
import { publicProcedure } from '@/server/trpc'

export const categoryRouter = {
  list: publicProcedure.query(async ({ ctx }) => {
    try {
      const list = await ctx.db
        .select({
          id: categories.id,
          name: categories.name,
          imgSrc: categories.imgSrc,
          description: categories.description,
          courseCount: countDistinct(courseCategories.courseId),
        })
        .from(categories)
        .leftJoin(
          courseCategories,
          eq(categories.id, courseCategories.categoryId),
        )
        .groupBy(categories.id, courseCategories.categoryId)
        .where(eq(categories.isActive, true))
        .orderBy(asc(categories.name))

      return list
    } catch (error) {
      console.error(error)
      return []
    }
  }),
  getById: publicProcedure
    .input(z.object({ categoryId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (input.categoryId === 'logo.png') {
        return null
      }

      try {
        const item = await ctx.db.query.categories.findFirst({
          where: and(
            eq(categories.id, input.categoryId),
            eq(categories.isActive, true),
          ),
        })

        return item ? item : null
      } catch (error) {
        console.error('[categoryRouter.getById]', error)
        return null
      }
    }),
} satisfies TRPCRouterRecord
