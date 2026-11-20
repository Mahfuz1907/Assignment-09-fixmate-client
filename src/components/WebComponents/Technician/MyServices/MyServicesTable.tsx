"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Clock,
  EyeOff,
  FolderKanban,
  MapPin,
  Pencil,
  PlusCircle,
  Trash2,
  TriangleAlert,
  Wrench,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { IService, ServiceApprovalStatus } from "@/library/type";
import { UpdateAvailable } from "@/library/Action/Services";
import { toast } from "sonner";

const PRICE_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const STATUS_META: Record<
  ServiceApprovalStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  approved: {
    label: "Approved",
    badgeClass:
      "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    dotClass: "bg-emerald-500",
  },
  pending: {
    label: "Pending",
    badgeClass:
      "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    dotClass: "bg-amber-500",
  },
  rejected: {
    label: "Rejected",
    badgeClass:
      "border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300",
    dotClass: "bg-rose-500",
  },
};

function StatusBadge({ status }: { status: ServiceApprovalStatus }) {
  const meta = STATUS_META[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        "h-6 gap-1.5 rounded-full px-2.5 text-[10px] font-semibold uppercase tracking-wider",
        meta.badgeClass,
      )}
    >
      <span className={cn("size-1.5 rounded-full", meta.dotClass)} />
      {meta.label}
    </Badge>
  );
}

function AvailabilityIndicator({ service }: { service: IService }) {
  const [isAvailable, setIsAvailable] = useState(service.isAvailable);

  const handleAvailabilityChange = async (checked: boolean) => {
    setIsAvailable(checked);
    console.log(`${service.title} isAvailable:`, checked);
    const result = await UpdateAvailable(service._id as string, {
      isAvailable: checked,
    });

    if (result.acknowledged) {
      toast.success(
        `${service.title} is ${checked ? "available" : "not available"} now`,
        { position: "top-center" },
      );
    }
  };

  return (
    <div className="flex items-center gap-2.5">
      <Switch
        checked={isAvailable}
        onCheckedChange={handleAvailabilityChange}
        aria-label={`Toggle availability for ${service.title}`}
        className="data-checked:bg-emerald-500"
      />
      <span
        className={cn(
          "text-xs font-medium",
          isAvailable
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-muted-foreground",
        )}
      >
        {isAvailable ? "Available" : "Paused"}
      </span>
    </div>
  );
}

function ServiceThumb({
  service,
  className,
}: {
  service: IService;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(service.image) && !failed;

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted",
        className,
      )}
    >
      {showImage ? (
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 64px, 56px"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex size-full items-center justify-center text-muted-foreground">
          <Wrench className="size-5" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}

/** Stub handlers — hook these up to the edit/delete actions later. */
function handleEdit(service: IService) {
  void service;
  // TODO: open the pre-filled edit form (and reset approvalStatus to "pending").
}

function handleDelete(service: IService) {
  void service;
  // TODO: open the delete confirmation modal, then remove the service.
}

function ServiceActions({ service }: { service: IService }) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label={`Edit ${service.title}`}
        title="Edit service"
        onClick={() => handleEdit(service)}
        className="rounded-lg border-border/70 text-muted-foreground transition-colors hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-300"
      >
        <Pencil className="size-3.5" aria-hidden="true" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`Delete ${service.title}`}
        title="Delete service"
        onClick={() => handleDelete(service)}
        className="rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="size-3.5" aria-hidden="true" />
      </Button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-amber-400/20 to-orange-500/10 text-amber-600 ring-1 ring-amber-500/20 dark:text-amber-400">
        <Wrench className="size-7" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-base font-bold tracking-tight">
        No services listed yet
      </h3>
      <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
        Add your first repair service so customers can find you, compare prices
        and send requests.
      </p>
      <Button
        render={<Link href="/dashboard/technician/add-service" />}
        nativeButton={false}
        className="mt-5 h-10 gap-2 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-orange-500 px-4 font-semibold text-zinc-950 shadow-[0_10px_24px_-14px_rgba(245,158,11,0.9)] hover:from-amber-300 hover:to-orange-500"
      >
        <PlusCircle className="size-4" aria-hidden="true" />
        Add your first service
      </Button>
    </div>
  );
}

type MyServicesTableProps = {
  services: IService[];
  loadError?: boolean;
};

export function MyServicesTable({
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

  const live = services.filter(
    (service) => service.approvalStatus === "approved" && service.isAvailable,
  ).length;

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

      {/* Listing panel */}
      <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3.5 sm:px-5">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <FolderKanban className="size-4" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-sm font-bold tracking-tight">All services</h2>
              <p className="text-[11px] text-muted-foreground">
                {counts.total} listing{counts.total === 1 ? "" : "s"} · {live}{" "}
                live on the marketplace
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="hidden gap-1.5 rounded-full border-border/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:inline-flex"
          >
            Technician
          </Badge>
        </div>

        {services.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Desktop / tablet table */}
            <div className="hidden md:block">
              <Table className="min-w-[820px]">
                <TableHeader>
                  <TableRow className="border-border/60 bg-muted/30 hover:bg-muted/30">
                    <TableHead className="h-11 px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Service
                    </TableHead>
                    <TableHead className="h-11 px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Category
                    </TableHead>
                    <TableHead className="h-11 px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Starting price
                    </TableHead>
                    <TableHead className="h-11 px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Approval
                    </TableHead>
                    <TableHead className="h-11 px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Availability
                    </TableHead>
                    <TableHead className="h-11 px-4 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service, index) => (
                    <TableRow
                      key={service._id ?? `${service.title}-${index}`}
                      className="border-border/60 hover:bg-muted/40"
                    >
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <ServiceThumb service={service} className="size-14" />
                          <div className="min-w-0">
                            <p
                              title={service.title}
                              className="max-w-[18rem] truncate text-sm font-semibold text-foreground"
                            >
                              {service.title}
                            </p>
                            <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                              <MapPin
                                className="size-3 shrink-0"
                                aria-hidden="true"
                              />
                              <span className="max-w-[16rem] truncate">
                                {service.serviceArea || "Service area not set"}
                              </span>
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className="rounded-full border-border/70 bg-muted/40 px-2.5 text-[11px] font-medium text-muted-foreground"
                        >
                          {service.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className="text-sm font-bold text-foreground">
                          {PRICE_FORMATTER.format(service.basePrice)}
                        </span>
                        <span className="ml-1 text-[10px] font-medium text-muted-foreground">
                          starting
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <StatusBadge status={service.approvalStatus} />
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <AvailabilityIndicator service={service} />
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <ServiceActions service={service} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-border/60 md:hidden">
              {services.map((service, index) => (
                <article
                  key={service._id ?? `${service.title}-${index}`}
                  className="p-4"
                >
                  <div className="flex gap-3">
                    <ServiceThumb service={service} className="size-16" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="line-clamp-2 text-sm font-semibold leading-5 text-foreground">
                          {service.title}
                        </p>
                        <StatusBadge status={service.approvalStatus} />
                      </div>
                      <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <span className="font-medium text-foreground/80">
                          {service.category}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{service.serviceMode}</span>
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-foreground">
                          {PRICE_FORMATTER.format(service.basePrice)}
                          <span className="ml-1 text-[10px] font-medium text-muted-foreground">
                            starting
                          </span>
                        </span>
                        <AvailabilityIndicator service={service} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(service)}
                      className="h-9 flex-1 gap-1.5 rounded-xl border-border/70 text-xs font-semibold"
                    >
                      <Pencil className="size-3.5" aria-hidden="true" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(service)}
                      className="h-9 flex-1 gap-1.5 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                      Delete
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default MyServicesTable;
