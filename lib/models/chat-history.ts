import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export interface EnvironmentalData {
  energyUsage: number;
  carbonEmissions: number;
  waterUsage: number;
  efficiency: string;
  tokenCount: number;
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  reasoningTokens: number;
  cachedInputTokens: number;
}

export interface History {
  _id?: ObjectId;
  userId: ObjectId;
  query: string;
  response: string;
  environmental: EnvironmentalData;
  tokenUsage: TokenUsage;
  createdAt: Date;
}

export class HistoryModel {
  static async create(
    historyData: Omit<History, "_id" | "createdAt">
  ): Promise<History> {
    const db = await getDatabase();
    const histories = db.collection<History>("histories");

    const history: Omit<History, "_id"> = {
      ...historyData,
      createdAt: new Date(),
    };

    const result = await histories.insertOne(history);
    return { ...history, _id: result.insertedId };
  }

  static async findByUserId(userId: string): Promise<History[]> {
    const db = await getDatabase();
    const histories = db.collection<History>("histories");
    return await histories.find({ userId: new ObjectId(userId) }).toArray();
  }

  static async deleteByUserId(userId: string): Promise<void> {
    const db = await getDatabase();
    const histories = db.collection<History>("histories");
    await histories.deleteMany({ userId: new ObjectId(userId) });
  }
}
