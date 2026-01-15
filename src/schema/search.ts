import * as z from 'zod'

export const searchParamsSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
  from: z.string().optional(),
  to: z.string().optional(),
  sort: z.string().optional().default('createdAt.desc'),
  query: z.string().optional(),
})
