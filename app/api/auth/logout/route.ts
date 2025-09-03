import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const response = Response.json({ success: true })

    // Clear the auth cookie
    response.headers.set("Set-Cookie", "auth-token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0")

    return response
  } catch (error) {
    return Response.json({ error: "Logout failed" }, { status: 500 })
  }
}
