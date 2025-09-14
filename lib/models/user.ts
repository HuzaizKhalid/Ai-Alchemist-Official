import { getDatabase } from "@/lib/mongodb";
// ...existing code...

import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { signUpSchema, validateObjectId } from "@/lib/validation";
import { logger } from "@/lib/logger";

export interface Subscription {
  stripeSubscriptionId: string;
  status:
    | "active"
    | "past_due"
    | "canceled"
    | "unpaid"
    | "trialing"
    | "incomplete"
    | "incomplete_expired";
  startDate: Date;
  endDate?: Date;
  plan: "free" | "pro";
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id?: ObjectId;
  email: string;
  name: string;
  password: string;
  plan: "free" | "pro";
  searchesUsed: number;
  searchesResetDate: Date;
  apiKey?: string;
  stripeCustomerId?: string;
  emailVerified: boolean;
  subscription?: Subscription;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
  apiKey?: string;
}

export class UserModel {
  static async create(userData: CreateUserData): Promise<User> {
    // Validate input
    const validatedData = signUpSchema.parse(userData);

    const db = await getDatabase();
    const users = db.collection<User>("users");

    // Check if user already exists
    const existingUser = await users.findOne({ email: validatedData.email });
    if (existingUser) {
      logger.warn("Attempt to create user with existing email", {
        email: validatedData.email,
      });
      throw new Error("User already exists");
    }

    // Hash password with higher cost for production
    const saltRounds = process.env.NODE_ENV === "production" ? 12 : 10;
    const hashedPassword = await bcrypt.hash(
      validatedData.password,
      saltRounds
    );

    const user: Omit<User, "_id"> = {
      email: validatedData.email.toLowerCase(), // Store emails in lowercase
      name: validatedData.name,
      password: hashedPassword,
      plan: "free",
      searchesUsed: 0,
      searchesResetDate: new Date(),
      apiKey: validatedData.apiKey,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const result = await users.insertOne(user);
      logger.info("User created successfully", {
        userId: result.insertedId.toString(),
      });
      return { ...user, _id: result.insertedId };
    } catch (error) {
      logger.error("Failed to create user", {
        error,
        email: validatedData.email,
      });
      throw new Error("User creation failed");
    }
  }

  static async findByEmail(email: string): Promise<User | null> {
    if (!email || typeof email !== "string") {
      return null;
    }

    const db = await getDatabase();
    const users = db.collection<User>("users");
    return await users.findOne({ email: email.toLowerCase() });
  }

  static async findById(id: string): Promise<User | null> {
    if (!validateObjectId(id)) {
      return null;
    }

    const db = await getDatabase();
    const users = db.collection<User>("users");
    return await users.findOne({ _id: new ObjectId(id) });
  }

  static async verifyPassword(user: User, password: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, user.password);
    } catch (error) {
      logger.error("Password verification failed", {
        error,
        userId: user._id?.toString(),
      });
      return false;
    }
  }

  static async incrementSearchCount(userId: string): Promise<void> {
    if (!validateObjectId(userId)) {
      throw new Error("Invalid user ID");
    }

    const db = await getDatabase();
    const users = db.collection<User>("users");

    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      logger.error("User not found for search increment", { userId });
      throw new Error("User not found");
    }

    // Reset search count if it's a new day
    const today = new Date();
    const resetDate = new Date(user.searchesResetDate);

    if (today.toDateString() !== resetDate.toDateString()) {
      await users.updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            searchesUsed: 1,
            searchesResetDate: today,
            updatedAt: new Date(),
          },
        }
      );
    } else {
      await users.updateOne(
        { _id: new ObjectId(userId) },
        {
          $inc: { searchesUsed: 1 },
          $set: { updatedAt: new Date() },
        }
      );
    }
  }

  static async canMakeSearch(userId: string): Promise<boolean> {
    const user = await this.findById(userId);
    if (!user) return false;

    if (user.plan === "pro") return true;

    // Check if it's a new day
    const today = new Date();
    const resetDate = new Date(user.searchesResetDate);

    if (today.toDateString() !== resetDate.toDateString()) {
      return true; // New day, reset count
    }

    // Higher limit for development/testing
    const dailyLimit = process.env.NODE_ENV === "development" ? 50 : 3;
    return user.searchesUsed < dailyLimit;
  }

  static async updateStripeCustomerId(
    userId: string,
    stripeCustomerId: string
  ): Promise<void> {
    if (!validateObjectId(userId)) {
      throw new Error("Invalid user ID");
    }

    const db = await getDatabase();
    const users = db.collection<User>("users");

    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          stripeCustomerId,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      throw new Error("User not found");
    }

    logger.info("Stripe customer ID updated", { userId, stripeCustomerId });
  }

  static async update(
    userId: string,
    updateData: Partial<Omit<User, "_id" | "createdAt">>
  ): Promise<void> {
    if (!validateObjectId(userId)) {
      throw new Error("Invalid user ID");
    }

    const db = await getDatabase();
    const users = db.collection<User>("users");

    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      throw new Error("User not found");
    }
  }

  static async updatePlan(userId: string, plan: "free" | "pro"): Promise<void> {
    if (!validateObjectId(userId)) {
      throw new Error("Invalid user ID");
    }

    const db = await getDatabase();
    const users = db.collection<User>("users");

    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          plan,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      throw new Error("User not found");
    }

    logger.info("User plan updated", { userId, plan });
  }

  static async createSubscription(
    userId: string,
    stripeSubscriptionId: string,
    status: Subscription["status"],
    plan: "free" | "pro"
  ): Promise<void> {
    if (!validateObjectId(userId)) {
      throw new Error("Invalid user ID");
    }

    const db = await getDatabase();
    const users = db.collection<User>("users");

    const subscription: Subscription = {
      stripeSubscriptionId,
      status,
      plan,
      startDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          subscription,
          plan,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      throw new Error("User not found");
    }

    logger.info("Subscription created", { userId, stripeSubscriptionId });
  }

  static async updateSubscription(
    userId: string,
    stripeSubscriptionId: string,
    updates: Partial<Subscription>
  ): Promise<void> {
    if (!validateObjectId(userId)) {
      throw new Error("Invalid user ID");
    }

    const db = await getDatabase();
    const users = db.collection<User>("users");

    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      logger.error("User not found for subscription update", { userId });
      throw new Error("User not found");
    }

    const subscription = user.subscription || {
      stripeSubscriptionId,
      status: updates.status || "incomplete",
      plan: updates.plan || "free",
      startDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          subscription: {
            ...subscription,
            ...updates,
            updatedAt: new Date(),
          },
          plan: updates.plan || subscription.plan,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      throw new Error("User not found");
    }

    logger.info("Subscription updated", { userId, stripeSubscriptionId });
  }

  static async findByStripeCustomerId(
    stripeCustomerId: string
  ): Promise<User | null> {
    if (!stripeCustomerId || typeof stripeCustomerId !== "string") {
      return null;
    }

    const db = await getDatabase();
    const users = db.collection<User>("users");
    return await users.findOne({ stripeCustomerId });
  }

  static async getTotalUserCount(): Promise<number> {
    const db = await getDatabase();
    const users = db.collection<User>("users");
    return users.countDocuments();
  }
}
