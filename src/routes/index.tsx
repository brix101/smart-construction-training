import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { CategoryCard, CategoryCardSkeleton } from '@/components/category-card'
import { ContentSection } from '@/components/content-section'
import { Shell } from '@/components/shell'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const { trpc } = Route.useRouteContext()

  const { data, isLoading } = useQuery(trpc.categories.list.queryOptions())

  return (
    <Shell>
      <ContentSection
        title="Courses"
        description="Explore available courses for you"
      >
        {data?.map((item) => (
          <CategoryCard key={item.id} category={item} href={`/c/${item.id}`} />
        ))}
        {isLoading &&
          Array.from({ length: 4 }).map((_, index) => (
            <CategoryCardSkeleton key={index} />
          ))}
      </ContentSection>
    </Shell>
  )
}
