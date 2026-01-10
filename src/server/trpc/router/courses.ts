import { TRPCRouterRecord } from '@trpc/server'
import { asc, eq, sql } from 'drizzle-orm'
import z from 'zod'

import { courseCategories, courses, topics } from '@/server/db/schema'
import { protectedProcedure } from '@/server/trpc/trpc'

export const coursesRouter = {
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
