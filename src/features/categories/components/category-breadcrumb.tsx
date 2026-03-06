import React from "react"
import { Result, useAtomValue } from "@effect-atom/atom-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "#/components/ui/breadcrumb"
import { Separator } from "#/components/ui/separator"
import { Skeleton } from "#/components/ui/skeleton"

import { getCategoryAtom } from "../atom"

export function CatgoryBreadCrumb({ id }: { id: string }) {
  const categoryAtom = React.useMemo(() => getCategoryAtom(id), [id])

  const result = useAtomValue(categoryAtom)

  const builder = Result.builder(result)
    .onInitial(() => <Skeleton className="h-full w-28" />)
    .onFailure(() => "Unknown Category")
    .onSuccess((category) => category.name)
    .render()

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Courses</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="h-5">{builder}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h2 className="line-clamp-1 h-8 text-xl font-bold md:text-2xl">
        {builder}
      </h2>
      <Separator className="my-1.5" />
    </div>
  )
}
