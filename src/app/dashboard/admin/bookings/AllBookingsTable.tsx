"use client";

import Image from "next/image";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { IBookings } from "@/library/type";

const STATUS_OPTIONS = [
  { value: "", label: "All" },
  { value: "requested", label: "Requested" },
  { value: "accepted", label: "Accepted" },
  { value: "in progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export function formatDate(value: Date | string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatAmount(booking: IBookings) {
  const amount = booking.finalAmount ?? booking.basePrice;
  return `$${amount.toFixed(2)}`;
}

export function statusBadge(booking: IBookings) {
  switch (booking.status) {
    case "requested":
      return (
        <Badge
          variant="outline"
          className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
        >
          Requested
        </Badge>
      );
    case "accepted":
      return (
        <Badge
          variant="outline"
          className="border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
        >
          Accepted
        </Badge>
      );
    case "in progress":
      return (
        <Badge
          variant="outline"
          className="border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300"
        >
          In Progress
        </Badge>
      );
    case "completed":
      return (
        <Badge
          variant="outline"
          className="border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
        >
          Completed
        </Badge>
      );
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>;
    case "cancelled":
      return <Badge variant="destructive">Cancelled</Badge>;
    default:
      return <Badge variant="secondary">{booking.status || "Requested"}</Badge>;
  }
}

export function paymentBadge(booking: IBookings) {
  switch (booking.paymentStatus) {
    case "paid":
      return (
        <Badge
          variant="outline"
          className="border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
        >
          Paid
        </Badge>
      );
    case "unpaid":
      return (
        <Badge
          variant="outline"
          className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
        >
          Unpaid
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary">{booking.paymentStatus || "Unpaid"}</Badge>
      );
  }
}

function PersonCell({ name, email }: { name: string; email: string }) {
  return (
    <div className="min-w-0">
      <p className="truncate text-sm font-medium text-foreground">{name}</p>
      <p className="truncate text-xs text-muted-foreground">{email}</p>
    </div>
  );
}

export default function AllBookingsTable({
  initialBookings,
}: {
  initialBookings: IBookings[];
}) {
  const [bookings] = useState(initialBookings);
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = bookings.filter(
    (booking) => statusFilter === "" || booking.status === statusFilter,
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select
          items={STATUS_OPTIONS}
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value ?? "")}
        >
          <SelectTrigger className="w-44" aria-label="Filter by status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {bookings.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No bookings on the platform yet.
        </p>
      ) : filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No bookings match the selected status filter.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border/70">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((booking) => (
                <TableRow key={booking._id} className="align-middle">
                  <TableCell className="align-middle">
                    <div className="flex min-w-0 items-center gap-3">
                      <Image
                        src={booking.serviceImage}
                        alt={booking.serviceTitle}
                        width={48}
                        height={48}
                        loading="lazy"
                        className="size-11 shrink-0 rounded-xl object-cover"
                      />
                      <span className="truncate font-medium text-foreground">
                        {booking.serviceTitle}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="align-middle whitespace-nowrap">
                    <PersonCell
                      name={booking.customerName}
                      email={booking.customerEmail}
                    />
                  </TableCell>
                  <TableCell className="align-middle whitespace-nowrap">
                    <PersonCell
                      name={booking.technicianName}
                      email={booking.technicianEmail}
                    />
                  </TableCell>
                  <TableCell className="align-middle whitespace-nowrap text-sm text-muted-foreground">
                    {formatDate(booking.preferredDate)}
                  </TableCell>
                  <TableCell className="align-middle">
                    {statusBadge(booking)}
                  </TableCell>
                  <TableCell className="align-middle">
                    {paymentBadge(booking)}
                  </TableCell>
                  <TableCell className="align-middle text-right font-semibold text-foreground">
                    {formatAmount(booking)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
