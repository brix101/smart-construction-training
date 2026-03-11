import { Result, useAtomRefresh, useAtomValue } from "@effect-atom/atom-react"
import { createFileRoute } from "@tanstack/react-router"
import { ContentSection } from "~/components/content-section"
import { Button } from "~/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty"
import { categoriesAtom } from "~/features/categories/atom"
import {
  CategoryCard,
  CategoryCardSkeleton,
} from "~/features/categories/components/category-card"
import { FolderCode } from "lucide-react"

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
            <div className="col-span-full">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FolderCode />
                  </EmptyMedia>
                  <EmptyTitle>No Courses Available</EmptyTitle>
                  <EmptyDescription>
                    We couldn't load the courses right now. Please check your
                    connection or try again in a few moments.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button onClick={refresh}>Retry</Button>
                </EmptyContent>
              </Empty>
            </div>
          )
        })
        .render()}
    </ContentSection>
  )
}
