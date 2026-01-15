import { TRPCRouterRecord } from '@trpc/server'
import { and, asc, desc, eq, sql } from 'drizzle-orm'
import z from 'zod'

import { searchParamsSchema } from '@/schema/search'
import { Course, courseCategories, courses, topics } from '@/server/db/schema'
import { protectedProcedure } from '@/server/trpc/trpc'

export const coursesRouter = {
  list: protectedProcedure
    .input(searchParamsSchema)
    .query(async ({ ctx, input: { page, per_page, q, sort } }) => {
      const fallbackPage = isNaN(page) || page < 1 ? 1 : page
      const limit = isNaN(per_page) ? 10 : per_page
      const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0

      // Column and order to sort by
      const [column, order] = (sort?.split('.') as [
        keyof Course | undefined,
        'asc' | 'desc' | undefined,
      ]) ?? ['createdAt', 'desc']

      try {
        const filter = [eq(courses.isActive, true)]

        if (q) {
          filter.push(
            sql`(
                setweight(to_tsvector('english', ${courses.name}), 'A') ||
                setweight(to_tsvector('english', ${courses.description}), 'B'))
                @@ to_tsquery('english', ${q}
              )`,
          )
        }

        const whereFilter = and(...filter)

        const list = await ctx.db
          .select()
          .from(courses)
          .where(whereFilter)
          .orderBy(
            column && column in courses
              ? order === 'asc'
                ? asc(courses[column])
                : desc(courses[column])
              : asc(courses.name),
          )
          .limit(limit)
          .offset(offset)

        return list
      } catch (error) {
        console.error(error)
        return []
      }
    }),
  getByCategoryId: protectedProcedure
    .input(z.object({ categoryId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.db
          .select({
            id: courses.id,
            name: courses.name,
            description: courses.description,
            level: courses.level,
            imgSrc: courses.imgSrc,
            isPublished: courses.isPublished,
            isActive: courses.isActive,
            sequence: courses.sequence,
            createdAt: courses.createdAt,
            updatedAt: courses.updatedAt,
          })
          .from(courseCategories)
          .leftJoin(courses, eq(courses.id, courseCategories.courseId))
          .orderBy(asc(courses.name))
          .where(eq(courseCategories.categoryId, input.categoryId))
      } catch (err) {
        console.error(err)
        return []
      }
    }),
  getById: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (input.courseId === 'logo.png') {
        return null
      }

      try {
        const item = await ctx.db.query.courses.findFirst({
          where: eq(courses.id, input.courseId),
          with: {
            topics: {
              where: eq(topics.isActive, true),
              orderBy: sql`COALESCE(SUBSTRING(${topics.name} FROM '^(\\d+)')::INTEGER,99999999)`,
            },
          },
        })

        return item ? item : null
      } catch (error) {
        console.error('[coursesRouter.getById]', error)
        return null
      }
    }),
} satisfies TRPCRouterRecord
