import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { MarkBookingPaid } from "@/library/Action/Payment";

type PaymentSuccessPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/");
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["payment_intent", "customer_details"],
    });
  } catch {
    redirect("/");
  }

  if (session.status !== "complete") {
    redirect("/");
  }

  const bookingId = session.metadata?.bookingId || "";
  const amountPaid = session.amount_total ? session.amount_total / 100 : 0;
  const transactionId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id || "";

  if (bookingId) {
    try {
      await MarkBookingPaid(bookingId, {
        paymentStatus: "paid",
        transactionId,
        customerEmail: session.customer_details?.email || "",
        amountPaid,
      });
    } catch (err) {
      console.error("Failed to mark booking as paid:", err);
    }
  }

  return (
    <div>
      <h1>Payment successful!</h1>
      {bookingId && <p>Booking ID: {bookingId}</p>}
      <p>Paid: ${amountPaid}</p>
      {transactionId && <p>Transaction ID: {transactionId}</p>}
    </div>
  );
}
