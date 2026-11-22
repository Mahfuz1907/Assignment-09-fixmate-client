import { Suspense } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetAllBookings } from "@/library/Action/Bookings";
import type { IBookings } from "@/library/type";
import type { Metadata } from "next";
import AllBookingsTable from "./AllBookingsTable";

export const metadata: Metadata = {
  title: "All Bookings · FixMate Admin",
  description:
    "Read-only overview of every booking on the platform with status and payment filters.",
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

function AllBookingsSkeleton() {
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

async function AllBookingsSection() {
  let bookings: IBookings[] = [];
  try {
    bookings = normalizeBookings(await GetAllBookings());
  } catch {
    bookings = [];
  }

  return (
    <Card className="border-border/70">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-base">All bookings</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-6 sm:px-6">
        <AllBookingsTable initialBookings={bookings} />
      </CardContent>
    </Card>
  );
}

const AllBookingsPage = () => {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          All Bookings
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
          Read-only overview of every booking on the platform.
        </p>
      </div>

      <Suspense fallback={<AllBookingsSkeleton />}>
        <AllBookingsSection />
      </Suspense>
    </div>
  );
};

export default AllBookingsPage;
