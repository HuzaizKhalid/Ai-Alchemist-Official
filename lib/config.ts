import { z } from "zod"

const envSchema = z.object({
  // Database
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  // JWT
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),

  // OpenAI
  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),

  // Stripe
  STRIPE_SECRET_KEY: z.string().min(1, "STRIPE_SECRET_KEY is required"),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, "STRIPE_WEBHOOK_SECRET is required"),
  STRIPE_PRO_PRICE_ID: z.string().min(1, "STRIPE_PRO_PRICE_ID is required"),

  // App
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
})

function validateEnv() {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join("\n")
      throw new Error(`Environment validation failed:\n${missingVars}`)
    }
    throw error
  }
}

export const env = validateEnv()

// Rate limiting configuration
export const RATE_LIMITS = {
  SEARCH_FREE_TIER: {
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 1000, // 3 requests per day
  },
  SEARCH_PRO_TIER: {
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 requests per minute
  },
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per 15 minutes
  },
} as const;
