// import type { NextRequest } from "next/server"
// // import { stripe, STRIPE_PLANS } from "@/lib/stripe"
// import { getUserFromRequest } from "@/lib/jwt"
// import { UserModel } from "@/lib/models/user"

// export async function POST(req: NextRequest) {
//   try {
//     const { plan } = await req.json()

//     // Verify authentication
//     const userPayload = getUserFromRequest(req)
//     if (!userPayload) {
//       return Response.json({ error: "Authentication required" }, { status: 401 })
//     }

//     // Validate plan
//     if (!plan || !(plan in STRIPE_PLANS)) {
//       return Response.json({ error: "Invalid plan selected" }, { status: 400 })
//     }

//     // Get user
//     const user = await UserModel.findById(userPayload.userId)
//     if (!user) {
//       return Response.json({ error: "User not found" }, { status: 404 })
//     }

//     // Check if user already has a pro subscription
//     if (user.plan === "pro") {
//       return Response.json({ error: "User already has a pro subscription" }, { status: 400 })
//     }

//     const selectedPlan = STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS]

//     // Create or retrieve Stripe customer
//     let customerId = user.stripeCustomerId

//     if (!customerId) {
//       const customer = await stripe.customers.create({
//         email: user.email,
//         name: user.name,
//         metadata: {
//           userId: user._id!.toString(),
//         },
//       })
//       customerId = customer.id

//       // Update user with Stripe customer ID
//       const db = await (await import("@/lib/mongodb")).getDatabase()
//       await db.collection("users").updateOne(
//         { _id: user._id },
//         {
//           $set: {
//             stripeCustomerId: customerId,
//             updatedAt: new Date(),
//           },
//         },
//       )
//     }

//     // Create checkout session
//     const session = await stripe.checkout.sessions.create({
//       customer: customerId,
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price: selectedPlan.priceId,
//           quantity: 1,
//         },
//       ],
//       mode: "subscription",
//       success_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard?success=true`,
//       cancel_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/pricing?canceled=true`,
//       metadata: {
//         userId: user._id!.toString(),
//         plan,
//       },
//       subscription_data: {
//         metadata: {
//           userId: user._id!.toString(),
//           plan,
//         },
//       },
//       allow_promotion_codes: true,
//       billing_address_collection: "required",
//     })

//     return Response.json({
//       sessionId: session.id,
//       url: session.url,
//     })
//   } catch (error) {
//     console.error("Stripe checkout error:", error)
//     return Response.json({ error: "Failed to create checkout session" }, { status: 500 })
//   }
// }
