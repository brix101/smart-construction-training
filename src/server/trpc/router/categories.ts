import { TRPCRouterRecord } from '@trpc/server'
import { and, asc, countDistinct, desc, eq, sql } from 'drizzle-orm'
import z from 'zod'

import { searchParamsSchema } from '@/schema/search'
import { categories, Category, courseCategories } from '@/server/db/schema'
import { protectedProcedure } from '@/server/trpc/trpc'

export const categoryRouter = {
  list: protectedProcedure.query(async ({ ctx }) => {
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
  getById: protectedProcedure
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
  transaction: protectedProcedure
    .input(searchParamsSchema)
    .query(async ({ ctx, input: { page, per_page, q, sort } }) => {
      const fallbackPage = isNaN(page) || page < 1 ? 1 : page
      const limit = isNaN(per_page) ? 10 : per_page
      const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0

      // Column and order to sort by
      const [column, order] = (sort?.split('.') as [
        keyof Category | undefined,
        'asc' | 'desc' | undefined,
      ]) ?? ['createdAt', 'desc']

      try {
        const transaction = await ctx.db.transaction(async (tx) => {
          const filter = [eq(categories.isActive, true)]

          if (q) {
            filter.push(
              sql`(
                setweight(to_tsvector('english', ${categories.name}), 'A') ||
                setweight(to_tsvector('english', ${categories.description}), 'B'))
                @@ to_tsquery('english', ${q}
              )`,
            )
          }

          const whereFilter = and(...filter)

          const items = await tx
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
            .limit(limit)
            .offset(offset)
            .where(whereFilter)
            .orderBy(
              column && column in categories
                ? order === 'asc'
                  ? asc(categories[column])
                  : desc(categories[column])
                : desc(categories.createdAt),
            )

          const count = await tx
            .select({
              count: sql<number>`count(${categories.id})`,
            })
            .from(categories)
            .where(whereFilter)
            .then((res) => res[0]?.count ?? 0)

          return {
            items,
            count,
            pageCount: Math.ceil(count / limit),
          }
        })

        return transaction
      } catch (error) {
        console.error('[categoryRouter.transaction]', error)
        return {
          items: [],
          count: 0,
          pageCount: 0,
        }
      }
    }),
} satisfies TRPCRouterRecord
