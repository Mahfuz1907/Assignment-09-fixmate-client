"use client";

import Link from "next/link";
import { ArrowRight, Banknote, Check, Copy, CreditCard, FileText, ReceiptText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PaymentSuccessInfo {
  bookingId: string;
  amountPaid: number;
  transactionId: string;
  sessionId: string;
}

interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-xs">
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export default function PaymentSuccessCard({
  info,
}: {
  info: PaymentSuccessInfo;
}) {
  const copyId = (value: string) => {
    try {
      void navigator.clipboard?.writeText(value);
    } catch {
      // clipboard is unavailable; nothing to do
    }
  };

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-2xl items-center justify-center px-4 py-10 sm:px-6">
      <Card className="w-full border-border/70 shadow-sm">
        <CardHeader className="pb-2 pt-6 text-center sm:pt-8">
          <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Check className="size-8" aria-hidden="true" />
          </span>
          <CardTitle className="mt-4 text-2xl sm:text-3xl">
            Payment Successful!
          </CardTitle>
          <CardDescription className="mt-1 text-xs sm:text-sm">
            Your payment has been completed. The technician will proceed with
            your repair shortly.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 px-4 pb-6 sm:px-8">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoRow icon={FileText} label="Booking ID" value={info.bookingId || "—"} />
            <InfoRow
              icon={CreditCard}
              label="Amount Paid"
              value={currency.format(info.amountPaid)}
            />
            <InfoRow
              icon={ReceiptText}
              label="Transaction ID"
              value={info.transactionId || info.sessionId}
            />
            <InfoRow
              icon={Banknote}
              label="Status"
              value={
                <Badge
                  variant="outline"
                  className="border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                >
                  Paid
                </Badge>
              }
            />
          </div>

          {info.bookingId ? (
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                className="gap-1.5 border-border/70 px-3 text-xs sm:px-4 sm:text-sm"
                onClick={() => copyId(info.bookingId)}
              >
                <Copy className="size-3.5" aria-hidden="true" />
                Copy Booking ID
              </Button>
            </div>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              render={<Link href="/dashboard/customer/bookings" />}
              nativeButton={false}
              className="h-10 flex-1 gap-2 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-orange-500 px-4 font-semibold text-zinc-950 shadow-[0_10px_24px_-14px_rgba(245,158,11,0.9)] hover:from-amber-300 hover:to-orange-500"
            >
              View My Bookings
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <Button
              render={<Link href="/" />}
              nativeButton={false}
              variant="outline"
              className="h-10 flex-1 rounded-xl border-border/70 font-semibold"
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
