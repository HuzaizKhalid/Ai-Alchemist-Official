import type { NextRequest } from "next/server"
import stripe from "@/lib/stripe-server";
import { getUserFromRequest } from "@/lib/jwt"
import { UserModel } from "@/lib/models/user"

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const userPayload = getUserFromRequest(req)
    if (!userPayload) {
      return Response.json({ error: "Authentication required" }, { status: 401 })
    }

    // Get user
    const user = await UserModel.findById(userPayload.userId)
    if (!user || !user.stripeCustomerId) {
      return Response.json({ error: "No subscription found" }, { status: 404 })
    }

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard`,
    })

    return Response.json({
      url: session.url,
    })
  } catch (error) {
    console.error("Stripe portal error:", error)
    return Response.json({ error: "Failed to create portal session" }, { status: 500 })
  }
}
