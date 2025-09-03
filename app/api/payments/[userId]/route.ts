import { NextRequest, NextResponse } from "next/server";
import { PaymentModel } from "@/lib/models/payment";
import { logger } from "@/lib/logger";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let payments;

    if (status) {
      payments = await PaymentModel.getPaymentsByStatus(userId, status as any);
    } else if (startDate && endDate) {
      payments = await PaymentModel.getPaymentsByDateRange(
        userId,
        new Date(startDate),
        new Date(endDate)
      );
    } else {
      payments = await PaymentModel.findByUserId(userId, limit);
    }

    return NextResponse.json({ payments });
  } catch (error) {
    logger.error("Failed to fetch user payments", { error });
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
