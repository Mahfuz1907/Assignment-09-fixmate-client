import { Suspense } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetBookingsByTechnician } from "@/library/Action/Bookings";
import { GettingSessionFromServer } from "@/library/GettingSessions/GetSessionServer";
import type { IBookings } from "@/library/type";
import type { Metadata } from "next";
import RequestsTable from "./RequestsTable";
import { getTokenFromServer } from "@/library/Action/GettingTokens/GettingTokenFromServer";

export const metadata: Metadata = {
  title: "Booking Requests · Technician Dashboard",
  description: "Review booking requests from customers and track their status.",
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

function RequestsSkeleton() {
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

async function RequestsSection() {
  const session = await GettingSessionFromServer();
  const user = session?.user;

  let bookings: IBookings[] = [];
  try {
    const token = await getTokenFromServer();
    bookings = normalizeBookings(
      await GetBookingsByTechnician(
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
        <CardTitle className="text-base">All booking requests</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-6 sm:px-6">
        <RequestsTable initialBookings={bookings} />
      </CardContent>
    </Card>
  );
}

const RequestsPage = () => {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Booking Requests
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
          Review booking requests from customers and track their status.
        </p>
      </div>

      <Suspense fallback={<RequestsSkeleton />}>
        <RequestsSection />
      </Suspense>
    </div>
  );
};

export default RequestsPage;
