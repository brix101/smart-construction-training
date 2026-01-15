import { parseAsIndex, parseAsInteger, parseAsString } from 'nuqs'
import * as z from 'zod'

import { User } from '@/features/users/types'
import { getSortingStateParser, sortingItemSchema } from '@/lib/parsers'
import { CategoryData } from '@/types/data'

export const searchParamsSchema = z.object({
  page: z.number().default(1),
  perPage: z.number().default(10),
  query: z.string().optional(),
  sort: z.array(sortingItemSchema).default([{ id: 'createdAt', desc: true }]),
})

export const searchParams = {
  page: parseAsIndex.withDefault(0),
  perPage: parseAsInteger.withDefault(10),
  query: parseAsString.withDefault(''),
}

export const usersSearchParams = {
  ...searchParams,
  sort: getSortingStateParser<User>().withDefault([
    { id: 'createdAt', desc: true },
  ]),
}

export const categoriesSearchParams = {
  ...searchParams,
  sort: getSortingStateParser<CategoryData>().withDefault([
    { id: 'name', desc: false },
  ]),
}
