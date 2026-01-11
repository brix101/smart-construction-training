import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/dashboard/courses')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_admin/dashboard/courses"!</div>
}
