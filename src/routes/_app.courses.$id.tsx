import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/courses/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  // TODO: use validate search for topicId to filter
  return <div>Hello "/_app/courses/$id"!</div>;
}
