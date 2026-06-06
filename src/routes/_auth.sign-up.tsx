import { SignUp } from "@clerk/tanstack-react-start";
import { createFileRoute } from "@tanstack/react-router";

import { siteConfig } from "~/lib/config";

export const Route = createFileRoute("/_auth/sign-up")({
  head: () => ({
    meta: [
      {
        title: `Sign Up - ${siteConfig.title}`,
        description: `Sign up for an account to access exclusive features and content on ${siteConfig.title}. Create your account today and join our community!`,
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return <SignUp />;
}
