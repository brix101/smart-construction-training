import { TRPCError, TRPCRouterRecord } from '@trpc/server'
import { and, asc, eq, ilike, lte, or, sql } from 'drizzle-orm'
import z from 'zod'

import { courses, topics } from '@/server/db/schema'
import { protectedProcedure } from '@/server/trpc/trpc'
import { TopicGroup } from '@/types/topic'

type GroupedTopics = Record<string, TopicGroup>

export const topicsRouter = {
  getById: protectedProcedure
    .input(z.object({ topicId: z.string() }))
    .query(async ({ ctx, input }) => {
      const topic = await ctx.db.query.topics.findFirst({
        where: eq(topics.id, input.topicId),
        with: {
          materials: {
            with: {
              material: true,
            },
          },
        },
      })

      return topic
    }),
  getByCourseId: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const list = await ctx.db.query.topics.findMany({
          where: and(
            eq(topics.courseId, input.courseId),
            eq(topics.isActive, true),
          ),
          orderBy: sql`COALESCE(SUBSTRING(${topics.name} FROM '^(\\d+)')::INTEGER,99999999)`,
        })

        return list
      } catch (error) {
        console.error('[topicsRouter.getByCourseId]:', error)
        return []
      }
    }),
  getTopics: protectedProcedure
    .input(z.object({ query: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const level = Number(ctx.session.user.publicMetadata.level || 0)
        const query = input.query

        const filteredTopics = await ctx.db
          .select({
            id: topics.id,
            name: topics.name,
            courseId: topics.courseId,
            course: courses.name,
            level: courses.level,
            isPublished: courses.isPublished,
          })
          .from(topics)
          .innerJoin(courses, eq(courses.id, topics.courseId))
          .where(
            and(
              lte(courses.level, level),
              eq(courses.isPublished, true),
              or(
                ilike(courses.name, `%${query}%`),
                ilike(topics.name, `%${query}%`),
              ),
            ),
          )
          .orderBy(asc(topics.name))
          .limit(10)

        const groupedByCourse = filteredTopics.reduce((result, item) => {
          const { courseId, course, ...rest } = item
          if (!result[courseId]) {
            result[courseId] = { courseId, course, topics: [] }
          }
          result[courseId].topics.push(rest)
          return result
        }, {} as GroupedTopics)

        return Object.values(groupedByCourse)
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch topics',
          cause: error,
        })
      }
    }),
} satisfies TRPCRouterRecord
