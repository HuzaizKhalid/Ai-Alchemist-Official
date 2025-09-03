import { z } from "zod"

// User validation schemas
export const signUpSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  apiKey: z
    .string()
    .optional()
    .refine((val) => !val || val.startsWith("sk-"), "API key must start with 'sk-'"),
})

export const signInSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z.string().min(1, "Password is required"),
})

export const searchSchema = z.object({
  query: z.string().min(1, "Query cannot be empty").max(1000, "Query must be less than 1000 characters").trim(),
})

export const stripeCheckoutSchema = z.object({
  plan: z.enum(["pro"], { errorMap: () => ({ message: "Invalid plan selected" }) }),
})

// Sanitization helpers
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "")
}

export function validateObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id)
}
