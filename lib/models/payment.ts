import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export interface PaymentRecord {
  _id?: ObjectId;
  userId: ObjectId;
  amount: number;
  currency?: string;
  paymentMethod?: string;
  status: "pending" | "completed" | "failed" | "refunded";
  transactionId?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PaymentModel {
  static async create(
    paymentData: Omit<PaymentRecord, "_id" | "createdAt" | "updatedAt">
  ): Promise<PaymentRecord> {
    const db = await getDatabase();
    const payments = db.collection<PaymentRecord>("payments");

    const payment: Omit<PaymentRecord, "_id"> = {
      ...paymentData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await payments.insertOne(payment);
    return { ...payment, _id: result.insertedId };
  }

  static async findByUserId(
    userId: string,
    limit = 10
  ): Promise<PaymentRecord[]> {
    const db = await getDatabase();
    const payments = db.collection<PaymentRecord>("payments");

    return await payments
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  }

  static async findById(paymentId: string): Promise<PaymentRecord | null> {
    const db = await getDatabase();
    const payments = db.collection<PaymentRecord>("payments");

    return await payments.findOne({ _id: new ObjectId(paymentId) });
  }

  static async updateStatus(
    paymentId: string,
    status: PaymentRecord["status"],
    transactionId?: string
  ): Promise<PaymentRecord | null> {
    const db = await getDatabase();
    const payments = db.collection<PaymentRecord>("payments");

    const updateData: Partial<PaymentRecord> = {
      status,
      updatedAt: new Date(),
    };

    if (transactionId) {
      updateData.transactionId = transactionId;
    }

    const result = await payments.findOneAndUpdate(
      { _id: new ObjectId(paymentId) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    return result.value;
  }

  static async getUserPaymentStats(userId: string): Promise<{
    totalPayments: number;
    totalAmount: number;
    completedPayments: number;
    pendingPayments: number;
    failedPayments: number;
    refundedPayments: number;
  }> {
    const db = await getDatabase();
    const payments = db.collection<PaymentRecord>("payments");

    const stats = await payments
      .aggregate([
        { $match: { userId: new ObjectId(userId) } },
        {
          $group: {
            _id: null,
            totalPayments: { $sum: 1 },
            totalAmount: {
              $sum: {
                $cond: [{ $eq: ["$status", "completed"] }, "$amount", 0],
              },
            },
            completedPayments: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
            },
            pendingPayments: {
              $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
            },
            failedPayments: {
              $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] },
            },
            refundedPayments: {
              $sum: { $cond: [{ $eq: ["$status", "refunded"] }, 1, 0] },
            },
          },
        },
      ])
      .toArray();

    return (
      stats[0] || {
        totalPayments: 0,
        totalAmount: 0,
        completedPayments: 0,
        pendingPayments: 0,
        failedPayments: 0,
        refundedPayments: 0,
      }
    );
  }

  static async getPaymentsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<PaymentRecord[]> {
    const db = await getDatabase();
    const payments = db.collection<PaymentRecord>("payments");

    return await payments
      .find({
        userId: new ObjectId(userId),
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .sort({ createdAt: -1 })
      .toArray();
  }

  static async getPaymentsByStatus(
    userId: string,
    status: PaymentRecord["status"]
  ): Promise<PaymentRecord[]> {
    const db = await getDatabase();
    const payments = db.collection<PaymentRecord>("payments");

    return await payments
      .find({
        userId: new ObjectId(userId),
        status: status,
      })
      .sort({ createdAt: -1 })
      .toArray();
  }
}
