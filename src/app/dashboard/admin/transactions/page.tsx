import { GetAllBookings } from "@/library/Action/Bookings";
import { GetAllPayments } from "@/library/Action/Payment";
import type { IBookings, IPayments } from "@/library/type";
import { Wallet } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Transactions · FixMate Admin",
  description:
    "Read-only overview of every payment made across the platform.",
};

interface PaymentRow {
  key: string;
  customerName: string;
  technicianName: string;
  serviceTitle: string;
  amount: number;
  transactionId: string;
  paidAt: Date | string;
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

const StatCard = ({
  icon: Icon,
  label,
  value,
  iconClassName,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  value: string;
  iconClassName: string;
}) => (
  <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-xs">
    <span
      className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
    >
      <Icon className="size-5" aria-hidden />
    </span>
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-bold tracking-tight text-foreground">
        {value}
      </p>
    </div>
  </div>
);

const TransactionsPage = async () => {
  let payments: IPayments[] = [];
  let totalRevenue = 0;
  let bookings: IBookings[] = [];

  try {
    const paymentsObject = await GetAllPayments();
    payments = normalizePayments(paymentsObject.payments);
    totalRevenue = paymentsObject.totalRevenue ?? 0;
    bookings = normalizeBookings(await GetAllBookings());
  } catch {
    payments = [];
    totalRevenue = 0;
    bookings = [];
  }

  const bookingById = new Map<string, IBookings>();
  for (const booking of bookings) {
    bookingById.set(String(booking._id), booking);
  }

  const rows: PaymentRow[] = payments.map((payment, index) => {
    const booking = bookingById.get(String(payment.bookingId ?? ""));
    const amount =
      payment.amount ?? (payment as { amountPaid?: number }).amountPaid ?? 0;
    return {
      key: payment._id ?? payment.transactionId ?? String(index),
      customerName: booking?.customerName ?? payment.customerName ?? "—",
      technicianName: booking?.technicianName ?? payment.technicianName ?? "—",
      serviceTitle: booking?.serviceTitle ?? payment.serviceTitle ?? "—",
      amount,
      transactionId: payment.transactionId ?? "",
      paidAt: payment.paidAt ?? "—",
    };
  });

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          All Transactions
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
          Read-only overview of every payment made across the platform.
        </p>
      </div>

      <div className="sm:max-w-sm">
        <StatCard
          icon={Wallet}
          label="Total Revenue"
          value={formatAmount(totalRevenue)}
          iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border/70">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b bg-muted/20">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Customer
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Technician
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Service
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Amount
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Transaction ID
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Payment Date
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.key}
                className="border-b transition-colors hover:bg-muted/50 last:border-0"
              >
                <td className="p-4 align-middle">
                  <p className="truncate font-medium text-foreground">
                    {row.customerName}
                  </p>
                </td>
                <td className="p-4 align-middle">
                  <p className="truncate font-medium text-foreground">
                    {row.technicianName}
                  </p>
                </td>
                <td className="p-4 align-middle">
                  <TruncateText text={row.serviceTitle} className="text-foreground" />
                </td>
                <td className="whitespace-nowrap p-4 align-middle font-semibold text-foreground">
                  {formatAmount(row.amount)}
                </td>
                <td className="p-4 align-middle">
                  <TruncateText
                    text={row.transactionId}
                    className="font-mono text-xs text-muted-foreground"
                  />
                </td>
                <td className="whitespace-nowrap p-4 align-middle text-sm text-muted-foreground">
                  {formatDate(row.paidAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsPage;
