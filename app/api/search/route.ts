import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import type { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/jwt";
import { UserModel } from "@/lib/models/user";
import { SearchModel } from "@/lib/models/search";
import { calculateEnvironmentalImpact } from "@/lib/environmental-calculator";
import { searchSchema, sanitizeInput } from "@/lib/validation";
import { RateLimiter } from "@/lib/rate-limiter";
import { RATE_LIMITS } from "@/lib/config";
import { logger } from "@/lib/logger";
import { toast } from "sonner";
import { ObjectId } from "mongodb";

const freeRateLimiter = new RateLimiter(RATE_LIMITS.SEARCH_FREE_TIER);
const proRateLimiter = new RateLimiter(RATE_LIMITS.SEARCH_PRO_TIER);

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const userPayload = getUserFromRequest(req);
    if (!userPayload) {
      return Response.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Validate input
    const body = await req.json();
    const { query } = searchSchema.parse(body);
    const sanitizedQuery = sanitizeInput(query);

    // Get user
    const user = await UserModel.findById(userPayload.userId);
    if (!user) {
      logger.error("User not found during search", {
        userId: userPayload.userId,
      });
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Rate limiting
    const rateLimiter = user.plan === "pro" ? proRateLimiter : freeRateLimiter;
    const rateLimit = await rateLimiter.checkLimit(
      `search:${user._id!.toString()}`
    );

    if (!rateLimit.allowed) {
      return Response.json(
        {
          error: "Rate limit exceeded",
          resetTime: rateLimit.resetTime.toISOString(),
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
            "X-RateLimit-Reset": rateLimit.resetTime.toISOString(),
          },
        }
      );
    }

    // Check daily search limit for free users
    if (user.plan === "free") {
      const canSearch = await UserModel.canMakeSearch(userPayload.userId);
      if (!canSearch) {
        return Response.json(
          { error: "Daily search limit reached" },
          { status: 429 }
        );
      }
    }

    // Validate API key for free tier
    let apiKey = process.env.OPENAI_API_KEY;
    if (user.plan === "free") {
      if (!user.apiKey) {
        return Response.json(
          { error: "API key required for free tier" },
          { status: 400 }
        );
      }
      apiKey = user.apiKey;
    }

    if (!apiKey) {
      logger.error("No API key available", {
        userId: user._id!.toString(),
        plan: user.plan,
      });
      return Response.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Generate AI response with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const result = await generateText({
        model: openai("gpt-4o"),
        prompt: sanitizedQuery,
        system:
          "You are a helpful assistant focused on providing accurate, informative responses while being environmentally conscious. Keep responses concise but comprehensive.",
        abortSignal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Calculate environmental impact using actual token counts
      const environmental = calculateEnvironmentalImpact(
        "gpt-4o",
        result.usage?.inputTokens || 0,
        result.usage?.outputTokens || 0,
        false // Use inference-only footprint by default
      );

      // Save search record
      await SearchModel.create({
        userId: new ObjectId(user._id),
        query: sanitizedQuery,
        response: result.text,
        modelUsed: "gpt-4o",
        environmental,
      });

      // Increment user's search count
      await UserModel.incrementSearchCount(userPayload.userId);

      logger.info("Search completed successfully", {
        userId: user._id!.toString(),
        tokenCount: environmental.tokenCount,
      });

      return Response.json({
        query: sanitizedQuery,
        response: result.text,
        environmental,
        tokenUsage: result.usage,
      });
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === "AbortError") {
        logger.warn("Search request timed out", {
          userId: user._id!.toString(),
        });
        return Response.json({ error: "Request timed out" }, { status: 408 });
      }

      throw error;
    }
  } catch (error) {
    logger.error("Search API error", { error });

    if (error instanceof Error) {
      // Don't expose internal errors to client
      if (error.message.includes("API key")) {
        return Response.json({ error: "Invalid API key" }, { status: 400 });
      }
      if (error.message.includes("quota")) {
        return Response.json({ error: "API quota exceeded" }, { status: 429 });
      }
    }

    return Response.json({ error: "Search failed" }, { status: 500 });
  }
}
