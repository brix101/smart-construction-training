import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/courses")({
  component: RouteComponent,
});

function RouteComponent() {
  // TODO: use validate search for categoryId to filter
  return <div>Hello "/_app/courses"!</div>;
}
