import { getDatabase } from "@/lib/mongodb"

interface RateLimitConfig {
  windowMs: number
  max: number
}

interface RateLimitRecord {
  _id?: string
  key: string
  count: number
  resetTime: Date
  createdAt: Date
}

export class RateLimiter {
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = config
  }

  async checkLimit(key: string): Promise<{ allowed: boolean; remaining: number; resetTime: Date }> {
    const db = await getDatabase()
    const rateLimits = db.collection<RateLimitRecord>("rate_limits")

    const now = new Date()
    const windowStart = new Date(now.getTime() - this.config.windowMs)

    // Clean up old records
    await rateLimits.deleteMany({ resetTime: { $lt: now } })

    // Find existing record
    let record = await rateLimits.findOne({ key })

    if (!record) {
      // Create new record
      const resetTime = new Date(now.getTime() + this.config.windowMs)
      record = {
        key,
        count: 1,
        resetTime,
        createdAt: now,
      }
      await rateLimits.insertOne(record)
      return { allowed: true, remaining: this.config.max - 1, resetTime }
    }

    if (record.count >= this.config.max) {
      return { allowed: false, remaining: 0, resetTime: record.resetTime }
    }

    // Increment count
    await rateLimits.updateOne({ key }, { $inc: { count: 1 } })

    return {
      allowed: true,
      remaining: this.config.max - (record.count + 1),
      resetTime: record.resetTime,
    }
  }
}
