import type z from "zod"
import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "@tanstack/react-router"
import { Controller, useForm } from "react-hook-form"

import { PasswordInput } from "~/components/password-input"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { Spinner } from "~/components/ui/spinner"
import { authClient } from "~/lib/auth-client"
import { cn } from "~/lib/utils"

import { signinSchema } from "../schema"
import { GoogleButton } from "./google-button"

type Input = z.infer<typeof signinSchema>

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isPending, setPending] = React.useState(false)

  const form = useForm({
    resolver: zodResolver(signinSchema),
    defaultValues: { email: "", password: "" },
  })

  function handleSubmit(data: Input) {
    authClient.signIn
      .email(
        {
          ...data,
          callbackURL: "/",
        },
        {
          onRequest() {
            setPending(true)
          },
          onError: ({ error }) => {
            form.setError("email", error, { shouldFocus: true })
            form.setError("password", {})
          },
        }
      )
      .finally(() => {
        setPending(false)
      })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FieldGroup>
              <Field>
                <GoogleButton />
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or
              </FieldSeparator>
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input placeholder="m@example.com" {...field} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <a
                        href="#"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <PasswordInput placeholder="********" {...field} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? <Spinner /> : "Login"}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <Link to="/sign-up">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
