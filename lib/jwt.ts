import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { env } from "@/lib/config";
import { logger } from "@/lib/logger";

export interface JWTPayload {
  userId: string;
  email: string;
  plan: "free" | "pro";
  iat?: number;
  exp?: number;
}

export function signToken(payload: Omit<JWTPayload, "iat" | "exp">): string {
  try {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: "7d",
      issuer: "Alchemist Ai",
      audience: "Alchemist Ai-users",
    });
  } catch (error) {
    logger.error("Failed to sign JWT token", { error });
    throw new Error("Token generation failed");
  }
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, env.JWT_SECRET, {
      issuer: "Alchemist Ai",
      audience: "Alchemist Ai-users",
    }) as JWTPayload;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn("Invalid JWT token", { error: error.message });
    } else {
      logger.error("JWT verification failed", { error });
    }
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  // Check Authorization header first
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // Fallback to cookie
  const cookie = req.cookies.get("auth-token");
  const cookieToken = cookie ? cookie.value : null;
  return cookieToken;
}

export function getUserFromRequest(req: NextRequest): JWTPayload | null {
  const token = getTokenFromRequest(req);
  if (!token) return null;

  return verifyToken(token);
}
