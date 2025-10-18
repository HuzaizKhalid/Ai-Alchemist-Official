import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface PlantedTree {
  id: string;
  plantingDate: Date;
  userId: string;
  ageInDays: number;
  cumulativeOffset: number;
}

export async function GET(request: NextRequest) {
  try {
    // Get user from JWT token
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const userId = decoded.userId;

    const db = await getDatabase();
    const treesCollection = db.collection("planted_trees");

    // Get user's trees
    const trees = await treesCollection.find({ userId }).toArray();

    // Calculate current age and offset for each tree
    const now = new Date();
    const DAILY_OFFSET_RATE = 0.000063; // tCO₂e per day

    const updatedTrees = trees.map((tree: any) => {
      const ageInDays = Math.floor(
        (now.getTime() - new Date(tree.plantingDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      const cumulativeOffset = ageInDays * DAILY_OFFSET_RATE;
      
      return {
        id: tree._id.toString(),
        plantingDate: tree.plantingDate,
        ageInDays,
        cumulativeOffset,
      };
    });

    return NextResponse.json({ trees: updatedTrees });
  } catch (error) {
    console.error("Error fetching trees:", error);
    return NextResponse.json(
      { error: "Failed to fetch trees" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user from JWT token
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const userId = decoded.userId;

    const body = await request.json();
    const { plantingDate } = body;

    if (!plantingDate) {
      return NextResponse.json(
        { error: "Planting date is required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const treesCollection = db.collection("planted_trees");

    // Create new tree record
    const newTree = {
      userId,
      plantingDate: new Date(plantingDate),
      createdAt: new Date(),
    };

    const result = await treesCollection.insertOne(newTree);

    // Calculate age and offset for response
    const now = new Date();
    const DAILY_OFFSET_RATE = 0.000063; // tCO₂e per day
    const ageInDays = Math.floor(
      (now.getTime() - new Date(plantingDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    const cumulativeOffset = ageInDays * DAILY_OFFSET_RATE;

    const responseTree = {
      id: result.insertedId.toString(),
      plantingDate: new Date(plantingDate),
      ageInDays,
      cumulativeOffset,
    };

    return NextResponse.json({ tree: responseTree }, { status: 201 });
  } catch (error) {
    console.error("Error adding tree:", error);
    return NextResponse.json(
      { error: "Failed to add tree" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get user from JWT token
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const userId = decoded.userId;

    const url = new URL(request.url);
    const treeId = url.searchParams.get("id");

    if (!treeId) {
      return NextResponse.json(
        { error: "Tree ID is required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const treesCollection = db.collection("planted_trees");

    // Delete tree (ensure it belongs to the user)
    const result = await treesCollection.deleteOne({
      _id: new ObjectId(treeId),
      userId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Tree not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting tree:", error);
    return NextResponse.json(
      { error: "Failed to delete tree" },
      { status: 500 }
    );
  }
}