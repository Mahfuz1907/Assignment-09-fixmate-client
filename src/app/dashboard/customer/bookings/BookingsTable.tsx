"use client";

import Image from "next/image";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import type { IBookings } from "@/library/type";
import { CancelBooking } from "@/library/Action/Bookings";
import { toast } from "sonner";
import PayBookingButton from "@/components/Payment/PayBookingButton";

export function formatDate(value: Date | string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatPrice(value?: number) {
  return `$${(value ?? 0).toFixed(2)}`;
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
      return <Badge variant="secondary">{booking.status || "Pending"}</Badge>;
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

function StatusActions({
  booking,
  onCancel,
}: {
  booking: IBookings;
  onCancel: (booking: IBookings) => void;
}) {
  if (booking.paymentStatus === "paid") {
    return (
      <Badge
        variant="outline"
        className="border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      >
        Paid
      </Badge>
    );
  }

  if (booking.status === "requested") {
    return (
      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button variant="outline" className="h-8">
              Cancel Request
            </Button>
          }
        />
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this request?</AlertDialogTitle>
            <AlertDialogDescription>
              “{booking.serviceTitle}” will be cancelled. You can still request
              this repair again from the services page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-8">Back</AlertDialogCancel>
            <AlertDialogAction
              className="h-8 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => onCancel(booking)}
            >
              Yes, cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  if (booking.status === "completed" && booking.paymentStatus === "unpaid") {
    return (
      <PayBookingButton bookingId={booking._id} amount={booking.basePrice} />
    );
  }

  return null;
}

function BookingsCard({
  booking,
  onCancel,
}: {
  booking: IBookings;
  onCancel: (booking: IBookings) => void;
}) {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardContent className="space-y-3 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          {booking.serviceImage ? (
            <Image
              src={booking.serviceImage}
              alt={booking.serviceTitle}
              width={64}
              height={64}
              loading="lazy"
              className="size-16 shrink-0 rounded-xl object-cover"
            />
          ) : (
            <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-muted" />
          )}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-bold text-foreground">
              {booking.serviceTitle}
            </h3>
            <p className="mt-0.5 truncate text-xs font-medium text-muted-foreground">
              {booking.technicianName}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {statusBadge(booking)}
          {paymentBadge(booking)}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>{formatDate(booking.preferredDate)}</span>
          <span className="font-semibold text-foreground">
            {formatPrice(booking.basePrice)}
          </span>
        </div>

        <div className="flex justify-end">
          <StatusActions booking={booking} onCancel={onCancel} />
        </div>
      </CardContent>
    </Card>
  );
}

export default function BookingsTable({
  initialBookings,
}: {
  initialBookings: IBookings[];
}) {
  const [bookings, setBookings] = useState(initialBookings);
  const isMobile = useIsMobile();

  const handleCancel = async (booking: IBookings) => {
    const nextStatus = "cancelled";
    const result = await CancelBooking(booking._id, { status: nextStatus });

    if (result.acknowledged) {
      toast.success(`${booking.serviceTitle} booking is cancelled!`, {
        position: "top-center",
      });
    }

    const updatedBooking: IBookings = {
      ...booking,
      status: nextStatus,
    };

    setBookings((prev) =>
      prev.map((b) => (b._id === booking._id ? updatedBooking : b)),
    );

    console.log("Updated booking:", updatedBooking);
    console.log("New status:", updatedBooking.status);
  };

  return (
    <div>
      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Preferred Date</TableHead>
              <TableHead>Base Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking._id} className="align-middle">
                <TableCell className="align-middle">
                  <div className="flex items-center gap-3">
                    {booking.serviceImage ? (
                      <Image
                        src={booking.serviceImage}
                        alt={booking.serviceTitle}
                        width={48}
                        height={48}
                        loading="lazy"
                        className="size-12 shrink-0 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted" />
                    )}
                    <span className="truncate font-medium text-foreground">
                      {booking.serviceTitle}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="align-middle whitespace-nowrap">
                  <p className="font-medium text-foreground">
                    {booking.technicianName}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {booking.technicianEmail}
                  </p>
                </TableCell>
                <TableCell className="align-middle whitespace-nowrap text-sm text-muted-foreground">
                  {formatDate(booking.preferredDate)}
                </TableCell>
                <TableCell className="align-middle font-semibold text-foreground">
                  {formatPrice(booking.basePrice)}
                </TableCell>
                <TableCell className="align-middle">
                  {statusBadge(booking)}
                </TableCell>
                <TableCell className="align-middle">
                  {paymentBadge(booking)}
                </TableCell>
                <TableCell className="align-middle text-right">
                  <div className="flex justify-end">
                    <StatusActions booking={booking} onCancel={handleCancel} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 sm:hidden">
        {bookings.map((booking) => (
          <BookingsCard
            key={booking._id}
            booking={booking}
            onCancel={handleCancel}
          />
        ))}
      </div>

      {isMobile && bookings.length === 0 && (
        <p className="sm:hidden pt-2 text-center text-sm text-muted-foreground">
          No bookings to show yet.
        </p>
      )}
    </div>
  );
}
