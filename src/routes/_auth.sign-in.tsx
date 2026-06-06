import { SignIn } from "@clerk/tanstack-react-start";
import { createFileRoute } from "@tanstack/react-router";

import { siteConfig } from "~/lib/config";

export const Route = createFileRoute("/_auth/sign-in")({
  head: () => ({
    meta: [
      {
        title: `Sign In - ${siteConfig.title}`,
        description: `Sign in to your account to access exclusive features and content on ${siteConfig.title}. Enter your credentials to log in and continue enjoying our services!`,
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return <SignIn />;
}
