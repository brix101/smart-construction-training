import type z from "zod"
import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "node_modules/@tanstack/react-router/dist/esm/link"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { PasswordInput } from "#/components/password-input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "#/components/ui/form"
import { Spinner } from "#/components/ui/spinner"
import { authClient } from "#/lib/auth-client"

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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <FieldGroup>
                <Field>
                  <GoogleButton />
                </Field>
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                  Or
                </FieldSeparator>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage className="capitalize" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="m@example.com" {...field} />
                      </FormControl>
                      <FormMessage className="capitalize" />
                    </FormItem>
                  )}
                />

                <Field>
                  <Field className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <PasswordInput placeholder="********" {...field} />
                          </FormControl>
                          <FormMessage className="capitalize" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <PasswordInput placeholder="********" {...field} />
                          </FormControl>
                          <FormMessage className="capitalize" />
                        </FormItem>
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
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
