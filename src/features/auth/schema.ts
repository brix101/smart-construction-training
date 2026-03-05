import { z } from "zod"

export const signinSchema = z.object({
  email: z.email({ error: "Email is required" }),
  password: z
    .string({ error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
})

export const signupSchema = signinSchema
  .extend({
    name: z.string({ error: "Name is required" }).min(1, "Name is required"),
    confirmPassword: z
      .string({ error: "Confirm Password is required" })
      .min(1, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  })
