import stripe from "@/lib/stripe-server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { priceId, userId } = body;

    // Enhanced debugging
    console.log("Full request body:", JSON.stringify(body, null, 2));
    console.log("Extracted priceId:", priceId);
    console.log("Extracted userId:", userId);
    console.log("userId type:", typeof userId);
    console.log("userId is null?", userId === null);
    console.log("userId is undefined?", userId === undefined);

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      );
    }

    // Add validation for userId
    if (!userId) {
      console.error("❌ No userId provided in request");
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    console.log("✅ Creating session with userId:", userId);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      client_reference_id: userId, // Pass user ID for reference
      mode: "subscription",
      success_url: `${process.env.NEXT_BASE_URL}/profile`,
      cancel_url: `${process.env.NEXT_BASE_URL}/pricing`,
    });

    // Verify the session was created with the userId
    console.log(
      "✅ Session created with client_reference_id:",
      session.client_reference_id
    );

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
