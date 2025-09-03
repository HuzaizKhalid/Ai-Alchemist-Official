import type { NextRequest } from "next/server"
import { UserModel } from "@/lib/models/user"
import { signToken } from "@/lib/jwt"
import { signUpSchema } from "@/lib/validation"
import { RateLimiter } from "@/lib/rate-limiter"
import { RATE_LIMITS, env } from "@/lib/config"
import { logger } from "@/lib/logger"

const authRateLimiter = new RateLimiter(RATE_LIMITS.AUTH)

export async function POST(req: NextRequest) {
  const clientIP = req.ip || req.headers.get("x-forwarded-for") || "unknown"

  try {
    // Rate limiting
    // const rateLimit = await authRateLimiter.checkLimit(`auth:${clientIP}`)
    // if (!rateLimit.allowed) {
    //   logger.warn("Auth rate limit exceeded", { ip: clientIP })
    //   return Response.json({ error: "Too many registration attempts. Please try again later." }, { status: 429 })
    // }

    // Validate input
    const body = await req.json();
    const validatedData = signUpSchema.parse(body);

    console.log(body, validatedData);

    // Create user
    const user = await UserModel.create(validatedData);

    // Generate JWT token
    const token = signToken({
      userId: user._id!.toString(),
      email: user.email,
      plan: user.plan,
    });

    // Set secure HTTP-only cookie
    const response = Response.json({
      success: true,
      user: {
        id: user._id!.toString(),
        email: user.email,
        name: user.name,
        plan: user.plan,
        searchesUsed: user.searchesUsed,
      },
    });

    const cookieOptions = [
      `auth-token=${token}`,
      "HttpOnly",
      "Path=/",
      `Max-Age=${7 * 24 * 60 * 60}`, // 7 days
      "SameSite=Strict",
    ];

    if (env.NODE_ENV === "production") {
      cookieOptions.push("Secure");
    }

    response.headers.set("Set-Cookie", cookieOptions.join("; "));

    logger.info("User registered successfully", {
      userId: user._id!.toString(),
    });
    return response;
  } catch (error) {
    logger.error("Sign up error", { error, ip: clientIP })

    if (error instanceof Error && error.message === "User already exists") {
      return Response.json({ error: "User already exists" }, { status: 409 })
    }

    return Response.json({ error: "Registration failed" }, { status: 500 })
  }
}
