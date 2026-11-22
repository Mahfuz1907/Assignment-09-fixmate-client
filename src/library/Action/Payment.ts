import { BookingPaymentPayload, MarkBookingPaidPayload } from "../type";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// Get Payments by Customer
export const GetPaymentsByEachCustomer = async (
  email: string,
  token: string,
) => {
  const res = await fetch(`${BASE_URL}/payments/customer/${email}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await res.json();
  return result;
};

// Get All Payments
export const GetAllPayments = async (token: string) => {
  const res = await fetch(`${BASE_URL}/all-payments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await res.json();
  return result;
};

export const GivePayment = async (
  id: string,
  amount: number,
  serviceTitle?: string,
) => {
  const res = await fetch("/api/checkout_sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, amount, serviceTitle }),
  });

  const data = await res.json();
  return { ...data, ok: res.ok };
};

export const MarkBookingPaid = async (
  bookingId: string,
  payload: BookingPaymentPayload,
) => {
  const res = await fetch(`${BASE_URL}/api/bookings/${bookingId}/pay`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  return { ...data, ok: res.ok };
};

export const markBookingPaidFromWebhook = async ({
  bookingId,
  paymentStatus = "paid",
  transactionId,
  customerEmail = "",
  amountPaid,
}: MarkBookingPaidPayload) => {
  const res = await fetch(`${BASE_URL}/api/bookings/${bookingId}/pay`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      paymentStatus,
      transactionId,
      customerEmail,
      amountPaid,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update booking via Express API: ${errorText}`);
  }

  return res.json();
};
