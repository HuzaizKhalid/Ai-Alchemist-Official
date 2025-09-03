import { NextRequest } from "next/server";
import { UserModel } from "@/lib/models/user";

export async function GET(req: NextRequest) {
    try {
        const totalUsers = await UserModel.getTotalUserCount();
        return Response.json({ totalUsers });
    } catch (error) {
        return Response.json({ error: "Failed to fetch user count" }, { status: 500 });
    }
}