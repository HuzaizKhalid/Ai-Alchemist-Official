import { NextResponse } from "next/server";
import stripe from "@/lib/stripe-server";
import { UserModel } from "@/lib/models/user";

export async function POST(req: Request) {
  try {
    const { subscriptionId, userId } = await req.json();

    if (!subscriptionId || !userId) {
      return NextResponse.json(
        { error: "Subscription ID and User ID are required" },
        { status: 400 }
      );
    }

    // Validate user exists
    const user = await UserModel.findById(userId);
    if (
      !user ||
      !user.subscription ||
      user.subscription.stripeSubscriptionId !== subscriptionId
    ) {
      return NextResponse.json(
        { error: "Invalid user or subscription" },
        { status: 400 }
      );
    }

    // Cancel the subscription in Stripe
    const subscription = await stripe.subscriptions.cancel(subscriptionId);

    // Update subscription in database
    await UserModel.updateSubscription(userId, subscriptionId, {
      status: "canceled",
      plan: "free",
      endDate: new Date(),
    });

    return NextResponse.json(
      { message: "Subscription cancelled successfully", subscription },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
