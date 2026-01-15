import * as z from 'zod'

export const searchParamsSchema = z.object({
  page: z.number().default(1),
  per_page: z.number().default(10),
  from: z.string().optional(),
  to: z.string().optional(),
  sort: z.string().optional().default('createdAt.desc'),
  q: z.string().optional(),
})

export const userSearchParamsSchema = searchParamsSchema.extend({
  firstName: z.string().optional(),
})
