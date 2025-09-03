import { NextResponse } from "next/server";
import { HistoryModel } from "@/lib/models/chat-history";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    //last should be at last index

    const histories = await HistoryModel.findByUserId(userId);
    return NextResponse.json({ success: true, histories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
