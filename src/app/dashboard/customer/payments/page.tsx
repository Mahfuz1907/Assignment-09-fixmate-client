import { Wrench } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GetBookingsByCustomer } from "@/library/Action/Bookings";
import { GetPaymentsByEachCustomer } from "@/library/Action/Payment";
import { GettingSessionFromServer } from "@/library/GettingSessions/GetSessionServer";
import type { IBookings, IPayments } from "@/library/type";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "My Payments · FixMate",
  description: "Track your payments, service details, and status.",
};

interface PaymentRow {
  bookingId: string;
  serviceTitle: string;
  technicianName: string;
  amount: number;
  transactionId: string;
  paidAt: Date | string;
  key: string;
}

function normalizeBookings(payload: unknown): IBookings[] {
  if (Array.isArray(payload)) {
    return payload as IBookings[];
  }
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data: unknown }).data)
  ) {
    return (payload as { data: IBookings[] }).data;
  }
  return [];
}

function normalizePayments(payload: unknown): IPayments[] {
  if (Array.isArray(payload)) {
    return payload as IPayments[];
  }
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data: unknown }).data)
  ) {
    return (payload as { data: IPayments[] }).data;
  }
  return [];
}

function formatDate(value: Date | string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

function TruncateText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span
      className={`line-clamp-2 break-all text-sm ${className ?? ""}`}
      title={text}
    >
      {text}
    </span>
  );
}

function PaymentsSkeleton() {
  return (
    <Card className="border-border/70">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-base">Your payments</CardTitle>
        <CardDescription>Loading payment history…</CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-6 sm:px-6">
        <div className="h-12 animate-pulse rounded-2xl bg-muted" />
        <div className="mt-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-10 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

async function MyPaymentsSection() {
  const session = await GettingSessionFromServer();
  const user = session?.user;
  const email = user?.email as string;

  let paymentRows: PaymentRow[] = [];
  try {
    const [payments, bookings] = await Promise.all([
      GetPaymentsByEachCustomer(email),
      GetBookingsByCustomer(email),
    ]);
    const normalizedPayments = normalizePayments(payments);
    const normalizedBookings = normalizeBookings(bookings);
    const bookingByPayment = new Map<string, (typeof normalizedBookings)[number]>();
    for (const booking of normalizedBookings) {
      bookingByPayment.set(String(booking._id), booking);
    }

    paymentRows = normalizedPayments.map((payment, index) => {
      const booking = bookingByPayment.get(String(payment.bookingId));
      return {
        key: payment.transactionId || String(payment._id) || String(index),
        bookingId: String(payment.bookingId ?? ""),
        serviceTitle:
          booking?.serviceTitle ?? payment.serviceTitle ?? "Not available",
        technicianName:
          booking?.technicianName ?? payment.technicianName ?? "—",
        amount: payment.amount ?? (payment as { amountPaid?: number }).amountPaid ?? 0,
        transactionId: payment.transactionId ?? "",
        paidAt: payment.paidAt ?? "—",
      };
    });
  } catch {
    paymentRows = [];
  }

  return (
    <Card className="border-border/70">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-base">Your payments</CardTitle>
        <CardDescription>
          {paymentRows.length > 0
            ? `${paymentRows.length} payment${paymentRows.length === 1 ? "" : "s"} found.`
            : "You haven’t made any payments yet."}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-6 sm:px-6">
        {paymentRows.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border/70 bg-card/60 px-6 py-14 text-center">
            <span className="flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500/15 to-sky-500/5 text-sky-600 dark:text-sky-400">
              <Wrench className="size-7" aria-hidden="true" />
            </span>
            <h3 className="text-base font-bold text-foreground">
              No payments yet
            </h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              Your payment history will appear here once you complete a repair.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border/70">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Payment Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentRows.map((row) => (
                  <TableRow key={row.key} className="align-middle">
                    <TableCell className="align-middle min-w-0">
                      <p className="truncate font-medium text-foreground">
                        {row.serviceTitle}
                      </p>
                    </TableCell>
                    <TableCell className="align-middle whitespace-nowrap">
                      <p className="font-medium text-foreground">
                        {row.technicianName}
                      </p>
                    </TableCell>
                    <TableCell className="align-middle whitespace-nowrap font-semibold text-foreground">
                      {formatAmount(row.amount)}
                    </TableCell>
                    <TableCell className="align-middle">
                      <TruncateText
                        text={row.transactionId}
                        className="font-mono text-xs text-muted-foreground"
                      />
                    </TableCell>
                    <TableCell className="align-middle whitespace-nowrap text-sm text-muted-foreground">
                      {formatDate(row.paidAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const MyPaymentsPage = () => {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Payment History
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
          Your completed repair payments — service, technician, amount,
          transaction, and date.
        </p>
      </div>

      <Suspense fallback={<PaymentsSkeleton />}>
        <MyPaymentsSection />
      </Suspense>
    </div>
  );
};

export default MyPaymentsPage;
