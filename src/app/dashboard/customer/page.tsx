import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import { CircleDot, SquareCheck, StickyNote } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import CustomerOverviewCharts from "./CustomerOverviewCharts";
import { GetBookingsByCustomer } from "@/library/Action/Bookings";
import { GettingSessionFromServer } from "@/library/GettingSessions/GetSessionServer";
import type { IBookings } from "@/library/type";
import { cn } from "@/lib/utils";
import { getTokenFromServer } from "@/library/Action/GettingTokens/GettingTokenFromServer";

export const metadata: Metadata = {
  title: "Customer Dashboard · FixMate",
  description: "Track your repair requests and completed jobs.",
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

interface StatCardProps {
  icon: LucideIcon;
  iconClassName: string;
  label: string;
  value: string;
  description: string;
}

function StatCard({
  icon: Icon,
  iconClassName,
  label,
  value,
  description,
}: StatCardProps) {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between pb-1 pr-1">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {label}
          </p>
          <CardDescription className="text-[11px]">
            {description}
          </CardDescription>
        </div>
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl",
            iconClassName,
          )}
        >
          <Icon className="size-4.5" aria-hidden="true" />
        </span>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

const CustomerDashboard = async () => {
  const session = await GettingSessionFromServer();
  const user = session?.user;

  let bookings: IBookings[] = [];
  try {
    const token = await getTokenFromServer();
    bookings = normalizeBookings(
      await GetBookingsByCustomer(user?.email as string, token),
    );
  } catch {
    bookings = [];
  }

  const totalRequests = bookings.length;
  const activeJobs = bookings.filter((booking) =>
    ["requested", "accepted", "in progress"].includes(booking.status),
  ).length;
  const completedJobs = bookings.filter(
    (booking) => booking.status === "completed",
  ).length;

  const stats: Array<{
    icon: LucideIcon;
    iconClassName: string;
    label: string;
    value: string;
    description: string;
  }> = [
    {
      icon: StickyNote,
      iconClassName:
        "border border-sky-500/20 bg-linear-to-br from-sky-500/15 to-sky-500/5 text-sky-600 dark:text-sky-400",
      label: "Total Requests",
      value: String(totalRequests),
      description: "Repairs you’ve requested",
    },
    {
      icon: CircleDot,
      iconClassName:
        "border border-emerald-500/20 bg-linear-to-br from-emerald-500/15 to-emerald-500/5 text-emerald-600 dark:text-emerald-400",
      label: "Active Jobs",
      value: String(activeJobs),
      description: "In progress right now",
    },
    {
      icon: SquareCheck,
      iconClassName:
        "border border-amber-500/20 bg-linear-to-br from-amber-500/15 to-amber-500/5 text-amber-600 dark:text-amber-400",
      label: "Completed Jobs",
      value: String(completedJobs),
      description: "Repairs finished",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Dashboard Overview
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
          Track your repair requests and completed jobs.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            iconClassName={stat.iconClassName}
            label={stat.label}
            value={stat.value}
            description={stat.description}
          />
        ))}
      </div>

      <CustomerOverviewCharts bookings={bookings} />
    </div>
  );
};

export default CustomerDashboard;
