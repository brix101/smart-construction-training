import { TRPCRouterRecord } from '@trpc/server'
import { and, eq, sql } from 'drizzle-orm'
import z from 'zod'

import { topics } from '@/server/db/schema'
import { publicProcedure } from '@/server/trpc'

export const topicsRouter = {
  getById: publicProcedure
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
  getByCourseId: publicProcedure
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
} satisfies TRPCRouterRecord
