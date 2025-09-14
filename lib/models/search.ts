import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { EnvironmentalMetrics } from "@/lib/environmental-calculator"

export interface SearchRecord {
  _id?: ObjectId
  userId: ObjectId
  query: string
  response: string
  modelUsed: string
  environmental: EnvironmentalMetrics
  createdAt: Date
}

export class SearchModel {
  static async create(searchData: Omit<SearchRecord, "_id" | "createdAt">): Promise<SearchRecord> {
    const db = await getDatabase()
    const searches = db.collection<SearchRecord>("searches")

    const search: Omit<SearchRecord, "_id"> = {
      ...searchData,
      createdAt: new Date(),
    }

    const result = await searches.insertOne(search)
    return { ...search, _id: result.insertedId }
  }

  static async findByUserId(userId: string, limit = 10): Promise<SearchRecord[]> {
    const db = await getDatabase()
    const searches = db.collection<SearchRecord>("searches")

    return await searches
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()
  }

  static async getUserStats(userId: string): Promise<{
    totalSearches: number
    totalEnergyUsed: number
    totalCarbonEmissions: number
    totalWaterUsed: number
  }> {
    const db = await getDatabase()
    const searches = db.collection<SearchRecord>("searches")

    const stats = await searches
      .aggregate([
        { $match: { userId: new ObjectId(userId) } },
        {
          $group: {
            _id: null,
            totalSearches: { $sum: 1 },
            totalEnergyUsed: { $sum: "$environmental.energyUsage" },
            totalCarbonEmissions: { $sum: "$environmental.carbonEmissions" },
            totalWaterUsed: { $sum: "$environmental.waterUsage" },
          },
        },
      ])
      .toArray()

    return (
      stats[0] || {
        totalSearches: 0,
        totalEnergyUsed: 0,
        totalCarbonEmissions: 0,
        totalWaterUsed: 0,
      }
    )
  }

  static async getRecentGlobalHistory(limit = 5): Promise<SearchRecord[]> {
    const db = await getDatabase()
    const searches = db.collection<SearchRecord>("searches")

    return await searches
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()
  }
}
