import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { searchParamsSchema } from '@/schema/search'

export const Route = createFileRoute('/_admin/dashboard/categories')({
  validateSearch: searchParamsSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const { trpc } = Route.useRouteContext()
  const search = Route.useSearch()

  const { data } = useQuery(trpc.categories.transaction.queryOptions(search))

  console.log('Categories data:', data)

  return <div>Hello "/_admin/dashboard/categories"!</div>
}
