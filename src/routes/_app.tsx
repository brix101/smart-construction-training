import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

export const getAuthState = createServerFn({ method: "GET" })
  .inputValidator((data: { redirect?: string }) => data)
  .handler(async ({ data, context }) => {
    const { isAuthenticated } = await context.auth();

    if (!isAuthenticated) {
      throw redirect({
        replace: true,
        to: "/sign-in",
        search: {
          redirect: data.redirect,
        },
      });
    }
  });

export const Route = createFileRoute("/_app")({
  ssr: true,
  beforeLoad: async ({ location }) => {
    const isBase = ["/", "/courses"].includes(location.href);

    return getAuthState({
      data: {
        redirect: !isBase ? location.href : undefined,
      },
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="container mx-auto">
      <Outlet />
    </section>
  );
}
