import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'

import { categories } from '@/server/db/schema'

export const categoryCreateSchema = createInsertSchema(categories, {
  name: (s) => s.min(1, { message: 'Category name is required.' }).max(255),
  description: (s) => s.max(255),
}).omit({
  id: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
})

export const categoryUpdateSchema = createUpdateSchema(categories)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    id: z.uuid(),
  })

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>
