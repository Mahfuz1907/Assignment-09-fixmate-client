"use client";

import Link from "next/link";
import { CircleX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentCancelPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-md items-center justify-center px-4 py-12 sm:px-6">
      <Card className="w-full border-border/70 shadow-sm">
        <CardHeader className="pb-2 pt-6 text-center sm:pt-8">
          <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <CircleX className="size-8" aria-hidden="true" />
          </span>
          <CardTitle className="mt-4 text-2xl sm:text-3xl">
            Payment Cancelled
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5 px-4 pb-6 sm:px-8">
          <p className="text-center text-sm leading-6 text-muted-foreground">
            You cancelled the payment process. No charges were made.
          </p>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              render={<Link href="/dashboard/user/my-bookings" />}
              nativeButton={false}
              className="h-10 flex-1 gap-2 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-orange-500 px-4 font-semibold text-zinc-950 shadow-[0_10px_24px_-14px_rgba(245,158,11,0.9)] hover:from-amber-300 hover:to-orange-500"
            >
              Try Again
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
