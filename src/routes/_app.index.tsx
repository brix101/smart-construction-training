import { createFileRoute, redirect } from "@tanstack/react-router";

// This route is used to redirect from "/" to "/courses"
export const Route = createFileRoute("/_app/")({
  loader: () => {
    return redirect({
      to: "/courses",
      replace: true,
    });
  },
});
