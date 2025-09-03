import stripe from "@/lib/stripe-server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const prices = await stripe.prices.list({
      expand: ["data.product"],
      active: true,
      type: "recurring",
    });

    const plans = prices.data.map((price) => ({
      id: price.id,
      name: (price.product as any).name,
      description:
        (price.product as any).description || "No description available",
      price: price.unit_amount || 0,
      interval: price.recurring?.interval || "month",
      price_id: price.id,
    }));

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}
