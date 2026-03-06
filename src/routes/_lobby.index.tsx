import { Result, useAtomRefresh, useAtomValue } from "@effect-atom/atom-react"
import { createFileRoute } from "@tanstack/react-router"

import { ContentSection } from "#/components/content-section"
import { Button } from "#/components/ui/button"
import { categoriesAtom } from "#/features/categories/atom"
import {
  CategoryCard,
  CategoryCardSkeleton,
} from "#/features/categories/components/category-card"

export const Route = createFileRoute("/_lobby/")({
  component: RouteComponent,
})

function RouteComponent() {
  const result = useAtomValue(categoriesAtom)
  const refresh = useAtomRefresh(categoriesAtom)

  return (
    <ContentSection
      title="Courses"
      description="Explore available courses for you"
    >
      {Result.builder(result)
        .onInitial(() =>
          Array.from({ length: 4 }).map((_, index) => (
            <CategoryCardSkeleton key={index} />
          ))
        )
        .onSuccess((value) =>
          value.map((item) => (
            <CategoryCard
              key={item.id}
              category={item}
              href={`/c/${item.id}`}
            />
          ))
        )
        .onFailure(() => {
          return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
              <p className="mb-2 text-red-700 dark:text-red-200">
                Failed to load data. Please try again.
              </p>
              <Button onClick={refresh} variant={"destructive"}>
                Retry
              </Button>
            </div>
          )
        })
        .render()}
    </ContentSection>
  )
}
