import type { NextRequest } from "next/server"
import { getUserFromRequest } from "@/lib/jwt"
import { UserModel } from "@/lib/models/user"

export async function GET(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req)
    if (!userPayload) {
      return Response.json({ error: "Not authenticated" }, { status: 401 })
    }

    const user = await UserModel.findById(userPayload.userId)
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    // Check if search count should be reset (new day)
    const today = new Date()
    const resetDate = new Date(user.searchesResetDate)
    let searchesUsed = user.searchesUsed

    if (today.toDateString() !== resetDate.toDateString()) {
      searchesUsed = 0 // Reset for new day
    }

    return Response.json({
      id: user._id!.toString(),
      email: user.email,
      name: user.name,
      plan: user.plan,
      searchesUsed,
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return Response.json({ error: "Authentication check failed" }, { status: 500 })
  }
}
