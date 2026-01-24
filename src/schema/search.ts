import {
  parseAsArrayOf,
  parseAsIndex,
  parseAsInteger,
  parseAsString,
} from 'nuqs'
import * as z from 'zod'

import { User } from '@/features/users/types'
import { getSortingStateParser, sortingItemSchema } from '@/lib/parsers'
import { RouterOutput } from '@/server/trpc/router/_app'

export const searchParamsSchema = z.object({
  page: z.number().default(1),
  perPage: z.number().default(10),
  query: z.string().optional(),
  sort: z.array(sortingItemSchema).default([{ id: 'createdAt', desc: true }]),
  createdAt: z.array(z.number()).optional(),
})

export const searchParams = {
  page: parseAsIndex.withDefault(0),
  perPage: parseAsInteger.withDefault(10),
  query: parseAsString.withDefault(''),
  createdAt: parseAsArrayOf(parseAsInteger).withDefault([]),
}

export const usersSearchParams = {
  ...searchParams,
  sort: getSortingStateParser<User>().withDefault([
    { id: 'lastSignInAt', desc: true },
  ]),
}

export const categoriesSearchParams = {
  ...searchParams,
  sort: getSortingStateParser<
    RouterOutput['categories']['list']['items'][0]
  >().withDefault([{ id: 'name', desc: false }]),
}

export const coursesSearchParams = {
  ...searchParams,
  sort: getSortingStateParser<
    RouterOutput['courses']['list']['items'][0]
  >().withDefault([{ id: 'createdAt', desc: true }]),
}
