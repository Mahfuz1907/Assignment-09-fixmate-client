import { GetAllServices } from "@/library/Action/Services";
import { GetUsers } from "@/library/Action/Users";
import { GetAllBookings } from "@/library/Action/Bookings";
import { IService, IUsers, IBookings } from "@/library/type";
import { ShieldCheck, TriangleAlert, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Metadata } from "next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "cn";
import OverviewCharts from "./OverviewCharts";
import { getTokenFromServer } from "@/library/Action/GettingTokens/GettingTokenFromServer";

export const metadata: Metadata = {
  title: "Admin Dashboard · FixMate Admin",
  description:
    "Overview of platform health: users, technicians, and pending services.",
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

const AdminDashboard = async () => {
  const token = await getTokenFromServer();
  const allUsers = await GetUsers(token);
  const allTechnicians = allUsers.filter(
    (user: IUsers) => user.role === "technician",
  );
  const allServices = await GetAllServices("", token);
  const bookings = normalizeBookings(await GetAllBookings(token));
  const pendingServices = allServices.filter(
    (service: IService) => service.approvalStatus === "pending",
  );

  const totalUsers = allUsers.length;
  const totalTechnicians = allTechnicians.length;
  const totalPendingServices = pendingServices.length;

  const stats: Array<{
    icon: LucideIcon;
    iconClassName: string;
    label: string;
    value: string;
    description: string;
  }> = [
    {
      icon: Users,
      iconClassName:
        "border border-sky-500/20 bg-linear-to-br from-sky-500/15 to-sky-500/5 text-sky-600 dark:text-sky-400",
      label: "Total Users",
      value: String(totalUsers),
      description: "Registered accounts on the platform",
    },
    {
      icon: ShieldCheck,
      iconClassName:
        "border border-emerald-500/20 bg-linear-to-br from-emerald-500/15 to-emerald-500/5 text-emerald-600 dark:text-emerald-400",
      label: "Total Technicians",
      value: String(totalTechnicians),
      description: "Verified service providers",
    },
    {
      icon: TriangleAlert,
      iconClassName:
        "border border-amber-500/20 bg-linear-to-br from-amber-500/15 to-amber-500/5 text-amber-600 dark:text-amber-400",
      label: "Pending Services",
      value: String(totalPendingServices),
      description: "Awaiting technician review",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Admin Dashboard
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
          Quick overview of platform health and activity.
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

      <OverviewCharts bookings={bookings} services={allServices} />
    </div>
  );
};

export default AdminDashboard;
