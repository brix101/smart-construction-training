import type z from "zod"
import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "@tanstack/react-router"
import { Controller, useForm } from "react-hook-form"

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

import { signupSchema } from "../schema"
import { GoogleButton } from "./google-button"

type Input = z.infer<typeof signupSchema>

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isPending, setPending] = React.useState(false)

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "" },
  })

  function handleSubmit(data: Input) {
    authClient.signUp
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
            form.setError("name", {}, { shouldFocus: true })
            form.setError("email", error)
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
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
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
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">Full Name</FieldLabel>
                    <Input placeholder="John Doe" {...field} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
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

              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Controller
                    control={form.control}
                    name="password"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Input placeholder="********" {...field} />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="confirmPassword"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="confirmPassword">
                          Confirm Password
                        </FieldLabel>
                        <Input placeholder="********" {...field} />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </Field>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>

              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? <Spinner /> : "Create Account"}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link to="/sign-in">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
