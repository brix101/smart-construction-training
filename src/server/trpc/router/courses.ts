import { TRPCError, TRPCRouterRecord } from '@trpc/server'
import { and, asc, countDistinct, desc, eq, sql } from 'drizzle-orm'
import z from 'zod'

import type { Course } from '@/server/db/schema'
import { searchParamsSchema } from '@/schema/search'
import { courseCategories, courses, topics } from '@/server/db/schema'
import { protectedProcedure } from '@/server/trpc/trpc'

export const coursesRouter = {
  getAll: protectedProcedure
    .input(searchParamsSchema)
    .query(async ({ ctx, input: { page, perPage: limit, query, sort } }) => {
      const offset = page > 0 ? (page - 1) * limit : 0

      try {
        const where = and(
          eq(courses.isActive, true),
          query
            ? sql`(
                  setweight(to_tsvector('english', ${courses.name}), 'A') ||
                  setweight(to_tsvector('english', ${courses.description}), 'B'))
                  @@ to_tsquery('english', ${query}
                )`
            : undefined,
        )

        const orderBy =
          sort.length > 0
            ? sort.map((item) => {
                const column = courses[item.id as keyof Course]
                return item.desc ? desc(column) : asc(column)
              })
            : [asc(courses.createdAt)]

        const list = await ctx.db
          .select()
          .from(courses)
          .where(where)
          .orderBy(...orderBy)
          .limit(limit)
          .offset(offset)

        return list
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch courses',
          cause: error,
        })
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
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch courses by category ID',
          cause: err,
        })
      }
    }),
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (input.id === 'logo.png') {
        return null
      }

      try {
        const item = await ctx.db.query.courses.findFirst({
          where: and(eq(courses.id, input.id), eq(courses.isActive, true)),
        })

        return item
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch course by ID',
          cause: error,
        })
      }
    }),
  list: protectedProcedure
    .input(searchParamsSchema)
    .query(async ({ ctx, input }) => {
      const { page, perPage: limit, query, sort } = input
      const offset = page > 0 ? (page - 1) * limit : 0

      try {
        const list = await ctx.db.transaction(async (tx) => {
          const where = and(
            eq(courses.isActive, true),
            query
              ? sql`(
                  setweight(to_tsvector('english', ${courses.name}), 'A') ||
                  setweight(to_tsvector('english', ${courses.description}), 'B'))
                  @@ to_tsquery('english', ${query}
                )`
              : undefined,
          )

          const orderBy =
            sort.length > 0
              ? sort.map((item) => {
                  const column = courses[item.id as keyof Course]
                  return item.desc ? desc(column) : asc(column)
                })
              : [asc(courses.createdAt)]

          const items = await tx
            .select({
              id: courses.id,
              name: courses.name,
              description: courses.description,
              createdAt: courses.createdAt,
              topicCount: countDistinct(topics.id),
            })
            .from(courses)
            .leftJoin(topics, eq(topics.courseId, courses.id))
            .groupBy(courses.id)
            .where(where)
            .orderBy(...orderBy)
            .limit(limit)
            .offset(offset)

          const count = await tx
            .select({
              count: countDistinct(courses.id),
            })
            .from(courses)
            .where(where)
            .then((res) => res[0]?.count ?? 0)

          return {
            items,
            count,
            pageCount: Math.ceil(count / limit),
          }
        })

        return list
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch courses',
          cause: error,
        })
      }
    }),
} satisfies TRPCRouterRecord
