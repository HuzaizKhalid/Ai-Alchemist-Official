import { NextResponse } from "next/server";
import { HistoryModel } from "@/lib/models/chat-history";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const date = searchParams.get("date"); // Optional: specific date in YYYY-MM-DD format

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get all histories for the user
    const histories = await HistoryModel.findByUserId(userId);

    // Filter by date if provided, otherwise use today
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const dailyHistories = histories.filter((history) => {
      const historyDate = new Date(history.createdAt || new Date());
      return historyDate >= startOfDay && historyDate <= endOfDay;
    });

    // Calculate daily totals
    const dailyStats = dailyHistories.reduce(
      (acc, history) => {
        const env = history.environmental;
        return {
          totalSearches: acc.totalSearches + 1,
          totalEnergyUsage: acc.totalEnergyUsage + (env.energyUsage || 0),
          totalCarbonEmissions:
            acc.totalCarbonEmissions + (env.carbonEmissions || 0),
          totalWaterUsage: acc.totalWaterUsage + (env.waterUsage || 0),
          totalTokens: acc.totalTokens + (env.tokenCount || 0),
        };
      },
      {
        totalSearches: 0,
        totalEnergyUsage: 0,
        totalCarbonEmissions: 0,
        totalWaterUsage: 0,
        totalTokens: 0,
      }
    );

    // Round values for display
    const roundedStats = {
      ...dailyStats,
      totalEnergyUsage: Math.round(dailyStats.totalEnergyUsage * 10000) / 10000,
      totalCarbonEmissions:
        Math.round(dailyStats.totalCarbonEmissions * 100) / 100,
      totalWaterUsage: Math.round(dailyStats.totalWaterUsage * 100) / 100,
    };

    return NextResponse.json({
      success: true,
      dailyStats: roundedStats,
      date: targetDate.toISOString().split("T")[0],
      searchCount: dailyHistories.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
