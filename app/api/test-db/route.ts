import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Testing MongoDB connection...");

    // Test the database connection
    const db = await getDatabase();

    // Try to ping the database
    await db.admin().ping();

    // Get database stats
    const stats = await db.stats();

    console.log("✅ MongoDB connection successful!");
    console.log(`📊 Database: ${db.databaseName}`);
    console.log(`📄 Collections: ${stats.collections}`);

    return NextResponse.json({
      success: true,
      message: "MongoDB connection successful",
      database: db.databaseName,
      stats: {
        collections: stats.collections,
        dataSize: stats.dataSize,
        indexSize: stats.indexSize,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
