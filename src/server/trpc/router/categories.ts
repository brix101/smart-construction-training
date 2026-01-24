import { TRPCError, TRPCRouterRecord } from '@trpc/server'
import {
  and,
  asc,
  countDistinct,
  desc,
  DrizzleQueryError,
  eq,
  gte,
  inArray,
  sql,
} from 'drizzle-orm'
import z from 'zod'

import { pluralize } from '@/lib/pluralize'
import { categoryCreateSchema, categoryUpdateSchema } from '@/schema/category'
import { searchParamsSchema } from '@/schema/search'
import { categories, Category, courseCategories } from '@/server/db/schema'
import { protectedProcedure } from '@/server/trpc/trpc'

export const categoryRouter = {
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      const list = await ctx.db
        .select({
          id: categories.id,
          name: categories.name,
          imgSrc: categories.imgSrc,
          description: categories.description,
          createdAt: categories.createdAt,
          courseCount: countDistinct(courseCategories.courseId),
        })
        .from(categories)
        .leftJoin(
          courseCategories,
          eq(categories.id, courseCategories.categoryId),
        )
        .groupBy(categories.id, courseCategories.categoryId)
        .where(eq(categories.isActive, true))
        .having(gte(countDistinct(courseCategories.courseId), 1))
        .orderBy(asc(categories.name))

      return list
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch categories',
        cause: error,
      })
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
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch category by ID',
          cause: error,
        })
      }
    }),
  list: protectedProcedure
    .input(searchParamsSchema)
    .query(async ({ ctx, input: { page, perPage: limit, query, sort } }) => {
      const offset = page > 0 ? (page - 1) * limit : 0

      try {
        const list = await ctx.db.transaction(async (tx) => {
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

                  return item.desc ? desc(column) : asc(column)
                })
              : [asc(categories.name)]

          const items = await tx
            .select({
              id: categories.id,
              name: categories.name,
              imgSrc: categories.imgSrc,
              description: categories.description,
              createdAt: categories.createdAt,
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

        return list
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong while fetching categories',
          cause: error,
        })
      }
    }),
  create: protectedProcedure
    .input(categoryCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const role = ctx.session.user.publicMetadata?.role

      if (role !== 'admin') {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: "You don't have permission to create categories",
        })
      }

      try {
        const newCategory = await ctx.db
          .insert(categories)
          .values(input)
          .returning()

        return newCategory[0]
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong while creating category',
          cause: error,
        })
      }
    }),
  update: protectedProcedure
    .input(categoryUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const role = ctx.session.user.publicMetadata?.role

      if (role !== 'admin') {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: "You don't have permission to update categories",
        })
      }

      try {
        const { id, ...updateData } = input

        const updatedCategory = await ctx.db
          .update(categories)
          .set(updateData)
          .where(eq(categories.id, id))
          .returning()

        return updatedCategory[0]
      } catch (error) {
        if (
          error instanceof DrizzleQueryError &&
          (error.cause as any)?.code === '23505'
        ) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'A category with this name already exists.',
            cause: error,
          })
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong while updating category',
          cause: error instanceof Error ? error.cause : error,
        })
      }
    }),
  delete: protectedProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const role = ctx.session.user.publicMetadata?.role

      if (role !== 'admin') {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: "You don't have permission to delete categories",
        })
      }

      try {
        // await ctx.db.delete(categories).where(inArray(categories.id, input.ids))

        await ctx.db
          .update(categories)
          .set({ isActive: false })
          .where(inArray(categories.id, input.ids))

        return {
          ids: input.ids,
          message: `${pluralize('Category', input.ids.length)} deleted successfully`,
        }
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong while deleting categories',
          cause: error,
        })
      }
    }),
} satisfies TRPCRouterRecord
