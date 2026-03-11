import { createFileRoute } from "@tanstack/react-router"

import { CatgoryBreadCrumb } from "~/features/categories/components/category-breadcrumb"

export const Route = createFileRoute("/_lobby/c/$id/{-$slug}")({
  component: RouteComponent,
})

function RouteComponent() {
  const { id, slug } = Route.useParams()

  return (
    <>
      <CatgoryBreadCrumb id={id} />
    </>
  )
}
