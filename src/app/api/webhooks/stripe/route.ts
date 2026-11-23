import { getTokenFromServer } from "@/library/Action/GettingTokens/GettingTokenFromServer";
import { markBookingPaidFromWebhook } from "@/library/Action/Payment";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status === "paid") {
      const bookingId = session.metadata?.bookingId;
      const transactionId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id || session.id;
      const customerEmail =
        session.customer_details?.email || session.customer_email || "";
      const amountPaid = (session.amount_total ?? 0) / 100;

      if (bookingId) {
        try {
          await markBookingPaidFromWebhook({
            bookingId,
            paymentStatus: "paid",
            transactionId,
            customerEmail,
            amountPaid,
          });
        } catch (err) {
          console.error(err);
          return NextResponse.json(
            { error: "Failed to update booking" },
            { status: 500 },
          );
        }
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
