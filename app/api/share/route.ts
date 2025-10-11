import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

export async function POST(request: NextRequest) {
  try {
    const { query, response, environmental, tokenUsage } = await request.json();

    if (!query || !response) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate a unique share ID
    const shareId = btoa(encodeURIComponent(query + Date.now())).slice(0, 10);

    const client = new MongoClient(MONGODB_URI!);
    await client.connect();

    const db = client.db("AiAlchemist");
    const collection = db.collection("shared_searches");

    // Store the shared search
    const sharedSearch = {
      shareId,
      query,
      response,
      environmental,
      tokenUsage,
      createdAt: new Date(),
      accessCount: 0,
      lastAccessedAt: null,
    };

    await collection.insertOne(sharedSearch);
    await client.close();

    // Get base URL and ensure it doesn't end with slash to prevent double slashes
    const baseUrl = (
      process.env.NEXTAUTH_URL ||
      process.env.VERCEL_URL ||
      "http://localhost:3000"
    ).replace(/\/$/, "");
    const shareUrl = `${baseUrl}/shared/${shareId}?q=${encodeURIComponent(
      query
    )}`;

    return NextResponse.json({
      success: true,
      shareId,
      shareUrl,
    });
  } catch (error) {
    console.error("Error creating shared search:", error);
    return NextResponse.json(
      { error: "Failed to create shared search" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shareId = searchParams.get("shareId");

    if (!shareId) {
      return NextResponse.json(
        { error: "Share ID is required" },
        { status: 400 }
      );
    }

    const client = new MongoClient(MONGODB_URI!);
    await client.connect();

    const db = client.db("AiAlchemist");
    const collection = db.collection("shared_searches");

    // Find the shared search
    const sharedSearch = await collection.findOne({ shareId });

    if (!sharedSearch) {
      await client.close();
      return NextResponse.json(
        { error: "Shared search not found" },
        { status: 404 }
      );
    }

    // Increment access count
    await collection.updateOne(
      { shareId },
      {
        $inc: { accessCount: 1 },
        $set: { lastAccessedAt: new Date() },
      }
    );

    await client.close();

    return NextResponse.json({
      success: true,
      data: {
        query: sharedSearch.query,
        response: sharedSearch.response,
        environmental: sharedSearch.environmental,
        tokenUsage: sharedSearch.tokenUsage,
        createdAt: sharedSearch.createdAt,
        accessCount: sharedSearch.accessCount + 1,
      },
    });
  } catch (error) {
    console.error("Error fetching shared search:", error);
    return NextResponse.json(
      { error: "Failed to fetch shared search" },
      { status: 500 }
    );
  }
}
