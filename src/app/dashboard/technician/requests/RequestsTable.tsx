"use client";

import Image from "next/image";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { CancelBooking } from "@/library/Action/Bookings";
import { toast } from "sonner";

const STATUS_OPTIONS = [
  { value: "", label: "All" },
  { value: "requested", label: "Requested" },
  { value: "accepted", label: "Accepted" },
  { value: "in progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
] as const;

export function formatDate(value: Date | string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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

function StatusActions({
  booking,
  onAccept,
  onReject,
  onStartWork,
  onComplete,
}: {
  booking: IBookings;
  onAccept: (booking: IBookings) => void;
  onReject: (booking: IBookings) => void;
  onStartWork: (booking: IBookings) => void;
  onComplete: (booking: IBookings) => void;
}) {
  if (booking.status === "requested") {
    return (
      <div className="flex flex-wrap gap-1.5">
        <Button
          variant="outline"
          className="h-8"
          onClick={() => onAccept(booking)}
        >
          Accept
        </Button>
        <Button
          variant="destructive"
          className="h-8"
          onClick={() => onReject(booking)}
        >
          Reject
        </Button>
      </div>
    );
  }
  if (booking.status === "accepted") {
    return (
      <Button
        variant="outline"
        className="h-8"
        onClick={() => onStartWork(booking)}
      >
        Start Work
      </Button>
    );
  }
  if (booking.status === "in progress") {
    return (
      <Button
        variant="outline"
        className="h-8"
        onClick={() => onComplete(booking)}
      >
        Complete
      </Button>
    );
  }
  return null;
}

export default function RequestsTable({
  initialBookings,
}: {
  initialBookings: IBookings[];
}) {
  const [bookings, setBookings] = useState(initialBookings);
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = bookings.filter(
    (booking) => statusFilter === "" || booking.status === statusFilter,
  );

  const updateStatus = async (booking: IBookings, status: string) => {
    const updated: IBookings = { ...booking, status };
    console.log("Booking updated:", {
      previous: booking,
      updated,
    });

    const result = await CancelBooking(updated._id, { status: updated.status });
    if (result.acknowledged) {
      toast.success(`${updated.serviceTitle} status is ${updated.status}`, {
        position: "top-center",
      });
    }
    setBookings((prev) =>
      prev.map((b) => (b._id === booking._id ? updated : b)),
    );
  };

  const handleAccept = (booking: IBookings) =>
    updateStatus(booking, "accepted");
  const handleReject = (booking: IBookings) =>
    updateStatus(booking, "rejected");
  const handleStartWork = (booking: IBookings) =>
    updateStatus(booking, "in progress");
  const handleComplete = (booking: IBookings) =>
    updateStatus(booking, "completed");

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
          You don&rsquo;t have any booking requests yet.
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
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Preferred Date</TableHead>
                <TableHead>Problem Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                  <TableCell className="align-middle">
                    <p className="font-medium text-foreground">
                      {booking.customerName}
                    </p>
                  </TableCell>
                  <TableCell className="align-middle">
                    {booking.customerPhone || "—"}
                  </TableCell>
                  <TableCell className="align-middle">
                    <span
                      className="line-clamp-2 text-sm text-muted-foreground"
                      title={booking.address}
                    >
                      {booking.address}
                    </span>
                  </TableCell>
                  <TableCell className="align-middle whitespace-nowrap text-sm text-muted-foreground">
                    {formatDate(booking.preferredDate)}
                  </TableCell>
                  <TableCell className="align-middle">
                    <p
                      className="line-clamp-2 text-sm leading-6 text-muted-foreground"
                      title={booking.problemDescription}
                    >
                      {booking.problemDescription || "No description provided."}
                    </p>
                  </TableCell>
                  <TableCell className="align-middle">
                    {statusBadge(booking)}
                  </TableCell>
                  <TableCell className="align-middle text-right">
                    <div className="flex justify-end">
                      <StatusActions
                        booking={booking}
                        onAccept={handleAccept}
                        onReject={handleReject}
                        onStartWork={handleStartWork}
                        onComplete={handleComplete}
                      />
                    </div>
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
