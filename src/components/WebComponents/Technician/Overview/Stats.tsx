"use client";

import {
  BadgeCheck,
  FolderKanban,
  TriangleAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { IService } from "@/library/type";

type ServiceStatsProps = {
  services: IService[];
  loadError?: boolean;
  pendingRequests?: number;
};

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

export function ServiceStats({
  services,
  loadError = false,
  pendingRequests = 0,
}: ServiceStatsProps) {
  const counts = {
    total: services.length,
    approved: services.filter(
      (service) => service.approvalStatus === "approved",
    ).length,
  };

  const stats: Array<{
    icon: LucideIcon;
    iconClassName: string;
    label: string;
    value: string;
    description: string;
  }> = [
    {
      icon: FolderKanban,
      iconClassName:
        "border border-sky-500/20 bg-linear-to-br from-sky-500/15 to-sky-500/5 text-sky-600 dark:text-sky-400",
      label: "Total Services",
      value: String(counts.total),
      description: "Repair listings under your account",
    },
    {
      icon: BadgeCheck,
      iconClassName:
        "border border-emerald-500/20 bg-linear-to-br from-emerald-500/15 to-emerald-500/5 text-emerald-600 dark:text-emerald-400",
      label: "Approved Services",
      value: String(counts.approved),
      description: "Listed with admin approval",
    },
    {
      icon: TriangleAlert,
      iconClassName:
        "border border-amber-500/20 bg-linear-to-br from-amber-500/15 to-amber-500/5 text-amber-600 dark:text-amber-400",
      label: "Pending Requests",
      value: String(pendingRequests),
      description: "Requests awaiting response",
    },
  ];

  return (
    <div className="space-y-5">
      {loadError ? (
        <div className="flex items-start gap-3 rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-xs text-rose-700 dark:text-rose-300">
          <TriangleAlert
            className="mt-0.5 size-4 shrink-0"
            aria-hidden="true"
          />
          <p>
            We couldn&apos;t reach the service API just now. Check the server
            and refresh the page.
          </p>
        </div>
      ) : null}

      {/* Summary */}
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
    </div>
  );
}

export default ServiceStats;
