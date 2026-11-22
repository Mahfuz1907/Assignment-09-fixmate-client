"use client";

import {
  BadgeCheck,
  FolderKanban,
  TriangleAlert,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { IService } from "@/library/type";

type ServiceStatsProps = {
  services: IService[];
  loadError?: boolean;
  pendingRequests?: number;
};

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

  const stats = [
    {
      label: "Total Services",
      value: counts.total,
      icon: FolderKanban,
      tileClass: "bg-muted text-foreground",
      valueClass: "text-foreground",
    },
    {
      label: "Approved Services",
      value: counts.approved,
      icon: BadgeCheck,
      tileClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      valueClass: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Pending Requests",
      value: pendingRequests,
      icon: TriangleAlert,
      tileClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      valueClass: "text-amber-600 dark:text-amber-400",
    },
  ] as const;

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
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((stat) => {
          const StatIcon = stat.icon;

          return (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-3.5 shadow-xs transition-all duration-200 hover:shadow-sm"
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-xl",
                  stat.tileClass,
                )}
              >
                <StatIcon className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p
                  className={cn(
                    "text-lg font-bold leading-none tracking-tight",
                    stat.valueClass,
                  )}
                >
                  {stat.value}
                </p>
                <p className="mt-1 truncate text-[11px] font-medium text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ServiceStats;
