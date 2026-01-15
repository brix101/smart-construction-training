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
      console.error('[categoryRouter.list]', error)
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
    .query(async ({ ctx, input: { page, perPage: limit, query, sort } }) => {
      const offset = page > 0 ? (page - 1) * limit : 0

      try {
        const transaction = await ctx.db.transaction(async (tx) => {
          const whereFilter = and(
            eq(categories.isActive, true),
            query
              ? sql`(
                    setweight(to_tsvector('english', ${categories.name}), 'A') ||
                    setweight(to_tsvector('english', ${categories.description}), 'B'))
                    @@ to_tsquery('english', ${query}
                  )`
              : undefined,
          )

          const orderBy =
            sort.length > 0
              ? sort.map((item) => {
                  const column = categories[item.id as keyof Category]

                  console.log({ item })
                  return item.desc ? desc(column) : asc(column)
                })
              : [asc(categories.name)]

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
            .orderBy(...orderBy)

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
