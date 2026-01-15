import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/dashboard/categories')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_admin/dashboard/categories"!</div>
}
