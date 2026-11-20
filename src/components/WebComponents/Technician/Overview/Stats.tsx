"use client";

import {
  BadgeCheck,
  Clock,
  EyeOff,
  FolderKanban,
  TriangleAlert,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { IService } from "@/library/type";

type MyServicesTableProps = {
  services: IService[];
  loadError?: boolean;
};

export function ServiceStats({
  services,
  loadError = false,
}: MyServicesTableProps) {
  const counts = {
    total: services.length,
    approved: services.filter(
      (service) => service.approvalStatus === "approved",
    ).length,
    pending: services.filter((service) => service.approvalStatus === "pending")
      .length,
    paused: services.filter((service) => !service.isAvailable).length,
  };

  const stats = [
    {
      label: "Total listings",
      value: counts.total,
      icon: FolderKanban,
      tileClass: "bg-muted text-foreground",
      valueClass: "text-foreground",
    },
    {
      label: "Approved",
      value: counts.approved,
      icon: BadgeCheck,
      tileClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      valueClass: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Pending review",
      value: counts.pending,
      icon: Clock,
      tileClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      valueClass: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Paused",
      value: counts.paused,
      icon: EyeOff,
      tileClass: "bg-muted text-muted-foreground",
      valueClass: "text-muted-foreground",
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
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => {
          const StatIcon = stat.icon;

          return (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-3.5 shadow-xs"
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

      {counts.pending > 0 ? (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-xs text-amber-800 dark:text-amber-300">
          <Clock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>
            <strong className="font-semibold">
              {counts.pending} service{counts.pending === 1 ? "" : "s"}
            </strong>{" "}
            awaiting admin review. Listings stay hidden from customers until
            they&apos;re approved.
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default ServiceStats;
