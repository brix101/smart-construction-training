import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import {
  DashboardCourseCard,
  DashboardCourseCardSkeleton,
} from '@/components/dashboard-course-card'
import { searchParamsSchema } from '@/schema/search'

export const Route = createFileRoute('/_admin/dashboard/courses')({
  validateSearch: searchParamsSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const { trpc } = Route.useRouteContext()
  const search = Route.useSearch()

  const { data, isLoading } = useQuery(
    trpc.courses.list.queryOptions({ ...search, per_page: 1000 }),
  )

  return (
    <div className="mt-10">
      <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data?.map((course) => (
          <DashboardCourseCard course={course} href={`#`} />
        ))}

        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <DashboardCourseCardSkeleton key={i} />
          ))}
      </section>
    </div>
  )
}
