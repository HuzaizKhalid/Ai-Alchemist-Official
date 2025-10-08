import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { getUserFromRequest } from "@/lib/jwt";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    // Get user from cookies
    const userPayload = getUserFromRequest(request);
    if (!userPayload) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const year =
      searchParams.get("year") || new Date().getFullYear().toString();
    const date = searchParams.get("date"); // Format: YYYY-MM-DD

    const db = await getDatabase();
    const searches = db.collection("searches");

    // Get yearly usage stats
    const yearStart = new Date(`${year}-01-01T00:00:00.000Z`);
    const yearEnd = new Date(`${year}-12-31T23:59:59.999Z`);

    const yearlyStats = await searches
      .aggregate([
        {
          $match: {
            userId: new ObjectId(userPayload.userId),
            createdAt: { $gte: yearStart, $lte: yearEnd },
          },
        },
        {
          $group: {
            _id: null,
            totalSearches: { $sum: 1 },
            totalTokens: { $sum: "$environmental.tokenCount" },
            totalEnergyUsage: { $sum: "$environmental.energyUsage" },
            totalCarbonEmissions: { $sum: "$environmental.carbonEmissions" },
            totalWaterUsage: { $sum: "$environmental.waterUsage" },
          },
        },
      ])
      .toArray();

    // Get daily usage for each day of the year
    const dailyUsage = await searches
      .aggregate([
        {
          $match: {
            userId: new ObjectId(userPayload.userId),
            createdAt: { $gte: yearStart, $lte: yearEnd },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            searchCount: { $sum: 1 },
            tokenCount: { $sum: "$environmental.tokenCount" },
            energyUsage: { $sum: "$environmental.energyUsage" },
            carbonEmissions: { $sum: "$environmental.carbonEmissions" },
            waterUsage: { $sum: "$environmental.waterUsage" },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ])
      .toArray();

    // Get specific date usage if requested
    let specificDateUsage = null;
    if (date) {
      const dateStart = new Date(`${date}T00:00:00.000Z`);
      const dateEnd = new Date(`${date}T23:59:59.999Z`);

      const dateStats = await searches
        .aggregate([
          {
            $match: {
              userId: new ObjectId(userPayload.userId),
              createdAt: { $gte: dateStart, $lte: dateEnd },
            },
          },
          {
            $group: {
              _id: null,
              totalSearches: { $sum: 1 },
              totalTokens: { $sum: "$environmental.tokenCount" },
              totalEnergyUsage: { $sum: "$environmental.energyUsage" },
              totalCarbonEmissions: { $sum: "$environmental.carbonEmissions" },
              totalWaterUsage: { $sum: "$environmental.waterUsage" },
            },
          },
        ])
        .toArray();

      specificDateUsage = dateStats[0] || {
        totalSearches: 0,
        totalTokens: 0,
        totalEnergyUsage: 0,
        totalCarbonEmissions: 0,
        totalWaterUsage: 0,
      };
    }

    // Format daily usage as map for easy lookup
    const dailyUsageMap: Record<string, any> = {};
    dailyUsage.forEach((day: any) => {
      dailyUsageMap[day._id] = {
        searchCount: day.searchCount,
        tokenCount: day.tokenCount,
        energyUsage: day.energyUsage,
        carbonEmissions: day.carbonEmissions,
        waterUsage: day.waterUsage,
      };
    });

    return NextResponse.json({
      success: true,
      year: parseInt(year),
      yearlyStats: yearlyStats[0] || {
        totalSearches: 0,
        totalTokens: 0,
        totalEnergyUsage: 0,
        totalCarbonEmissions: 0,
        totalWaterUsage: 0,
      },
      dailyUsage: dailyUsageMap,
      specificDateUsage,
      searchDates: Object.keys(dailyUsageMap), // Dates with searches for green tick marks
    });
  } catch (error) {
    console.error("Calendar usage API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch calendar usage data",
      },
      { status: 500 }
    );
  }
}
