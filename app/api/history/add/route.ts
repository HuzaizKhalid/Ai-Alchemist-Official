import { NextResponse } from "next/server";
import { HistoryModel } from "@/lib/models/chat-history";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, query, response, environmental, tokenUsage } = body;

    if (!userId || !query || !response || !environmental || !tokenUsage) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const history = await HistoryModel.create({
      userId: new ObjectId(userId),
      query,
      response,
      environmental,
      tokenUsage,
    });

    return NextResponse.json({ success: true, history });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
