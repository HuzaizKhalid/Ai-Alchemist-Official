import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export interface Subscription {
  _id?: ObjectId;
  userId: ObjectId;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  status:
    | "active"
    | "canceled"
    | "incomplete"
    | "incomplete_expired"
    | "past_due"
    | "trialing"
    | "unpaid";
  currentPeriodStart: Date | null | undefined;
  currentPeriodEnd: Date | null | undefined;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class SubscriptionModel {
  static async create(
    subscriptionData: Omit<Subscription, "_id" | "createdAt" | "updatedAt">
  ): Promise<Subscription> {
    const db = await getDatabase();
    const subscriptions = db.collection<Subscription>("subscriptions");

    const subscription: Omit<Subscription, "_id"> = {
      ...subscriptionData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await subscriptions.insertOne(subscription);
    return { ...subscription, _id: result.insertedId };
  }

  static async findByUserId(userId: string): Promise<Subscription | null> {
    const db = await getDatabase();
    const subscriptions = db.collection<Subscription>("subscriptions");
    return await subscriptions.findOne({ userId: new ObjectId(userId) });
  }

  static async findByStripeSubscriptionId(
    stripeSubscriptionId: string
  ): Promise<Subscription | null> {
    const db = await getDatabase();
    const subscriptions = db.collection<Subscription>("subscriptions");
    return await subscriptions.findOne({ stripeSubscriptionId });
  }

  static async updateByStripeSubscriptionId(
    stripeSubscriptionId: string,
    updateData: Partial<Omit<Subscription, "_id" | "createdAt">>
  ): Promise<void> {
    const db = await getDatabase();
    const subscriptions = db.collection<Subscription>("subscriptions");

    await subscriptions.updateOne(
      { stripeSubscriptionId },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      }
    );
  }

  static async deleteByStripeSubscriptionId(
    stripeSubscriptionId: string
  ): Promise<void> {
    const db = await getDatabase();
    const subscriptions = db.collection<Subscription>("subscriptions");
    await subscriptions.deleteOne({ stripeSubscriptionId });
  }
}
