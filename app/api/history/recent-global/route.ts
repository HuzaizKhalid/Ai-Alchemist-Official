import { NextRequest } from "next/server";
import { SearchModel, SearchRecord } from "@/lib/models/search";
import { UserModel } from "@/lib/models/user";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '5'), 10); // Max 10, default 5

    // Get recent searches from all users
    const recentHistory = await SearchModel.getRecentGlobalHistory(limit);

    // Transform the data for frontend consumption
    const historyItems = await Promise.all(
      recentHistory.map(async (search: SearchRecord) => {
        // Get user name for display (optional - you might want to anonymize)
        let userName = 'Anonymous';
        try {
          const user = await UserModel.findById(search.userId.toString());
          userName = user?.name?.split(' ')[0] || 'Anonymous'; // Just first name for privacy
        } catch (error) {
          logger.warn("Could not fetch user for history item", { userId: search.userId });
        }

        return {
          id: search._id?.toString(),
          query: search.query,
          userName,
          createdAt: search.createdAt,
          // Truncate long queries for display
          displayQuery: search.query.length > 80 
            ? search.query.substring(0, 80) + "..." 
            : search.query
        };
      })
    );

    logger.info("Recent global history fetched", { 
      count: historyItems.length,
      requestedLimit: limit 
    });

    return Response.json({
      success: true,
      history: historyItems,
      count: historyItems.length
    });

  } catch (error) {
    logger.error("Failed to fetch recent global history", { error });
    
    return Response.json(
      { 
        success: false, 
        error: "Failed to fetch recent history",
        history: [],
        count: 0
      },
      { status: 500 }
    );
  }
}