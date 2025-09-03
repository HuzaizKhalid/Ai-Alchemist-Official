import { NextResponse } from "next/server";
import stripe from "@/lib/stripe-server";
import { UserModel } from "@/lib/models/user";
import { PaymentModel } from "@/lib/models/payment";
import Stripe from "stripe";
import { logger } from "@/lib/logger";
import { ObjectId } from "mongodb";

// Helper function to safely create payment records
async function createPaymentRecord(
  userId: ObjectId,
  amount: number,
  currency: string,
  status: "completed" | "failed" | "pending" | "refunded",
  transactionId: string,
  description: string,
  paymentMethod = "stripe"
) {
  try {
    const payment = await PaymentModel.create({
      userId,
      amount,
      currency: currency.toLowerCase(),
      status,
      paymentMethod,
      transactionId,
      description,
    });

    logger.info("Payment record created successfully", {
      paymentId: payment._id,
      userId: userId.toString(),
      amount,
      status,
      transactionId,
    });

    return payment;
  } catch (error) {
    logger.error("Failed to create payment record", {
      error,
      userId: userId.toString(),
      amount,
      status,
      transactionId,
    });
    // Don't throw - we don't want payment recording failures to break the webhook
    return null;
  }
}

// Helper function to update payment status
async function updatePaymentStatus(
  transactionId: string,
  newStatus: "completed" | "failed" | "refunded",
  userId?: string
) {
  try {
    // Try to find payment by transaction ID first
    const payments = await PaymentModel.findByUserId(userId || "", 100);
    const payment = payments.find(
      (p) =>
        p.transactionId === transactionId ||
        p.transactionId?.includes(transactionId)
    );

    if (payment) {
      await PaymentModel.updateStatus(payment._id!.toString(), newStatus);
      logger.info("Payment status updated", {
        paymentId: payment._id,
        transactionId,
        oldStatus: payment.status,
        newStatus,
      });
    }
  } catch (error) {
    logger.error("Failed to update payment status", {
      error,
      transactionId,
      newStatus,
    });
  }
}

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.client_reference_id;
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        logger.info("Checkout session completed", {
          userId,
          customerId,
          subscriptionId,
          sessionId: session.id,
          amount: session.amount_total,
        });

        if (!userId) {
          logger.error("No client_reference_id (userId) found in session", {
            sessionId: session.id,
          });
          return NextResponse.json(
            { error: "No user ID found in session" },
            { status: 400 }
          );
        }

        try {
          // Update user with Stripe customer ID
          await UserModel.updateStripeCustomerId(userId, customerId);

          // Create subscription record
          await UserModel.createSubscription(
            userId,
            subscriptionId,
            "active",
            "pro"
          );

          // Record successful payment
          if (session.amount_total && session.amount_total > 0) {
            await createPaymentRecord(
              new ObjectId(userId),
              session.amount_total / 100, // Convert from cents
              session.currency || "usd",
              "completed",
              (session.payment_intent as string) || session.id,
              `Subscription checkout - ${session.mode || "subscription"}`,
              "stripe"
            );
          }

          logger.info("Checkout session processed successfully", {
            userId,
            subscriptionId,
            amount: session.amount_total ? session.amount_total / 100 : 0,
          });
        } catch (dbError) {
          logger.error("Database update failed for checkout session", {
            error: dbError,
            userId,
            subscriptionId,
            sessionId: session.id,
          });
          return NextResponse.json(
            { error: "Database update failed" },
            { status: 500 }
          );
        }

        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        logger.info("Invoice payment succeeded", {
          invoiceId: invoice.id,
          subscriptionId,
          amount: invoice.amount_paid,
          customerId: invoice.customer,
        });

        try {
          const user = await UserModel.findByStripeCustomerId(
            invoice.customer as string
          );

          if (user && user.subscription) {
            // Update subscription status
            await UserModel.updateSubscription(
              user._id!.toString(),
              subscriptionId,
              { status: "active" }
            );

            // Record successful payment
            if (invoice.amount_paid && invoice.amount_paid > 0) {
              await createPaymentRecord(
                user._id!,
                invoice.amount_paid / 100,
                invoice.currency || "usd",
                "completed",
                (invoice.payment_intent as string) || invoice.id,
                `Invoice payment - ${
                  invoice.description || "Subscription renewal"
                }`,
                "stripe"
              );
            }

            logger.info("Invoice payment processed successfully", {
              userId: user._id!.toString(),
              subscriptionId,
              amount: invoice.amount_paid ? invoice.amount_paid / 100 : 0,
            });
          } else {
            logger.warn("User not found for successful invoice payment", {
              customerId: invoice.customer,
              invoiceId: invoice.id,
            });
          }
        } catch (dbError) {
          logger.error("Failed to process successful invoice payment", {
            error: dbError,
            subscriptionId,
            invoiceId: invoice.id,
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        logger.warn("Invoice payment failed", {
          invoiceId: invoice.id,
          subscriptionId,
          amount: invoice.amount_due,
          customerId: invoice.customer,
        });

        try {
          const user = await UserModel.findByStripeCustomerId(
            invoice.customer as string
          );

          if (user && user.subscription) {
            // Update subscription to past_due
            await UserModel.updateSubscription(
              user._id!.toString(),
              subscriptionId,
              { status: "past_due" }
            );

            // Record failed payment
            if (invoice.amount_due && invoice.amount_due > 0) {
              await createPaymentRecord(
                user._id!,
                invoice.amount_due / 100,
                invoice.currency || "usd",
                "failed",
                invoice.id,
                `Failed invoice payment - ${
                  invoice.description || "Subscription renewal"
                }`,
                "stripe"
              );
            }

            logger.info("Failed invoice payment processed", {
              userId: user._id!.toString(),
              subscriptionId,
              amount: invoice.amount_due ? invoice.amount_due / 100 : 0,
            });
          } else {
            logger.warn("User not found for failed invoice payment", {
              customerId: invoice.customer,
              invoiceId: invoice.id,
            });
          }
        } catch (dbError) {
          logger.error("Failed to process failed invoice payment", {
            error: dbError,
            subscriptionId,
            invoiceId: invoice.id,
          });
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        logger.info("Payment intent succeeded", {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          customerId: paymentIntent.customer,
        });

        // Update any existing payment records from pending to completed
        if (paymentIntent.customer) {
          try {
            const user = await UserModel.findByStripeCustomerId(
              paymentIntent.customer as string
            );

            if (user) {
              await updatePaymentStatus(
                paymentIntent.id,
                "completed",
                user._id!.toString()
              );
            }
          } catch (error) {
            logger.error("Failed to update payment intent status", {
              error,
              paymentIntentId: paymentIntent.id,
            });
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        logger.warn("Payment intent failed", {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          customerId: paymentIntent.customer,
        });

        // Update any existing payment records to failed
        if (paymentIntent.customer) {
          try {
            const user = await UserModel.findByStripeCustomerId(
              paymentIntent.customer as string
            );

            if (user) {
              await updatePaymentStatus(
                paymentIntent.id,
                "failed",
                user._id!.toString()
              );
            }
          } catch (error) {
            logger.error("Failed to update failed payment intent status", {
              error,
              paymentIntentId: paymentIntent.id,
            });
          }
        }
        break;
      }

      case "charge.dispute.created": {
        const dispute = event.data.object as Stripe.Dispute;
        const chargeId = dispute.charge as string;

        logger.warn("Charge dispute created", {
          disputeId: dispute.id,
          chargeId,
          amount: dispute.amount,
        });

        // You might want to mark related payments as disputed
        // This would require additional logic to find the payment by charge ID
        break;
      }

      case "invoice.payment_action_required": {
        const invoice = event.data.object as Stripe.Invoice;

        logger.info("Invoice payment action required", {
          invoiceId: invoice.id,
          subscriptionId: invoice.subscription,
        });

        // You might want to create a pending payment record here
        // and notify the user that action is required
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        logger.info("Subscription updated", {
          subscriptionId: subscription.id,
          status: subscription.status,
          customerId: subscription.customer,
        });

        try {
          const user = await UserModel.findByStripeCustomerId(
            subscription.customer as string
          );

          if (user) {
            const updates: any = {
              status: subscription.status,
            };

            // Update end date if subscription is canceled
            if (
              subscription.status === "canceled" &&
              subscription.canceled_at
            ) {
              updates.endDate = new Date(subscription.canceled_at * 1000);
            }

            await UserModel.updateSubscription(
              user._id!.toString(),
              subscription.id,
              updates
            );

            // Update user plan based on subscription status
            const newPlan = ["active", "trialing"].includes(subscription.status)
              ? "pro"
              : "free";

            await UserModel.updatePlan(user._id!.toString(), newPlan);

            logger.info("Subscription and plan updated successfully", {
              userId: user._id!.toString(),
              subscriptionId: subscription.id,
              status: subscription.status,
              plan: newPlan,
            });
          } else {
            logger.warn("User not found for subscription update", {
              customerId: subscription.customer,
              subscriptionId: subscription.id,
            });
          }
        } catch (dbError) {
          logger.error("Failed to update subscription", {
            error: dbError,
            subscriptionId: subscription.id,
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        logger.info("Subscription deleted", {
          subscriptionId: subscription.id,
          customerId: subscription.customer,
        });

        try {
          const user = await UserModel.findByStripeCustomerId(
            subscription.customer as string
          );

          if (user) {
            await UserModel.updateSubscription(
              user._id!.toString(),
              subscription.id,
              {
                status: "canceled",
                endDate: new Date(),
              }
            );

            // Downgrade user to free plan
            await UserModel.updatePlan(user._id!.toString(), "free");

            logger.info("Subscription canceled and user downgraded", {
              userId: user._id!.toString(),
              subscriptionId: subscription.id,
            });
          } else {
            logger.warn("User not found for subscription deletion", {
              customerId: subscription.customer,
              subscriptionId: subscription.id,
            });
          }
        } catch (dbError) {
          logger.error("Failed to cancel subscription", {
            error: dbError,
            subscriptionId: subscription.id,
          });
        }
        break;
      }

      default:
        logger.info("Unhandled webhook event", {
          eventType: event.type,
          eventId: event.id,
        });
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    logger.error("Webhook processing error", {
      error: err.message,
      stack: err.stack,
      eventType: err.event?.type,
    });
    return new NextResponse(`Webhook error: ${err.message}`, { status: 400 });
  }
}