import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { searchParamsSchema } from '@/schema/search'

export const Route = createFileRoute('/_admin/dashboard/users')({
  validateSearch: searchParamsSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const { trpc } = Route.useRouteContext()
  const search = Route.useSearch()

  const { data, isLoading } = useQuery(trpc.users.list.queryOptions(search))

  console.log({ data, isLoading })
  return <div>Hello "/_admin/dashboard/users"!</div>
}
