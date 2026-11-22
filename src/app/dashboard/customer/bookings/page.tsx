import { Suspense } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BookingsTable from "./BookingsTable";
import { GetBookingsByCustomer } from "@/library/Action/Bookings";
import { GettingSessionFromServer } from "@/library/GettingSessions/GetSessionServer";
import type { IBookings } from "@/library/type";
import { Metadata } from "next";
import { getTokenFromServer } from "@/library/Action/GettingTokens/GettingTokenFromServer";

export const metadata: Metadata = {
  title: "My Bookings . FixMate",
  icons: {
    icon: "/icon.svg",
  },
};

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

function BookingsSkeleton() {
  return (
    <div className="space-y-5 animate-pulse" aria-hidden="true">
      <div className="h-4 w-40 rounded bg-muted/60" />
      <div className="h-10 rounded-2xl border border-border/70 bg-card/60 p-4">
        <div className="h-6 w-3/5 rounded bg-muted/60" />
      </div>
      <div className="grid grid-cols-4 gap-3 sm:gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-10 rounded-2xl border border-border/70 bg-card/60"
          />
        ))}
      </div>
    </div>
  );
}

async function BookingsSection() {
  const session = await GettingSessionFromServer();
  const user = session?.user;

  let bookings: IBookings[] = [];
  try {
    const token = await getTokenFromServer();
    bookings = normalizeBookings(
      await GetBookingsByCustomer(
        (user?.email ?? "") as string,
        token as string,
      ),
    );
  } catch {
    bookings = [];
  }

  return (
    <Card className="border-border/70">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-base">Your requests</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-6 sm:px-6">
        {bookings.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            You don’t have any bookings yet. Head to{" "}
            <span className="font-medium text-foreground">Services</span> to
            request a repair.
          </p>
        ) : (
          <BookingsTable initialBookings={bookings} />
        )}
      </CardContent>
    </Card>
  );
}

const MyBookingsPage = () => {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="flex items-end gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Customer Portal
        </span>
        <span aria-hidden="true" className="text-muted-foreground/40">
          /
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-600 dark:text-amber-400">
          My Bookings
        </span>
      </div>
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          My Bookings
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
          Track requests, view status, and follow up on your repairs.
        </p>
      </div>

      <Suspense fallback={<BookingsSkeleton />}>
        <BookingsSection />
      </Suspense>
    </div>
  );
};

export default MyBookingsPage;
