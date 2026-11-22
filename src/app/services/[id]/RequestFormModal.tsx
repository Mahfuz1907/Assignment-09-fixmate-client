"use client";

import { useState, type FormEvent } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  IAddBookings,
  IBookings,
  IService,
  ISessionUser,
} from "@/library/type";
import { AddBookings, GetBookingsByCustomer } from "@/library/Action/Bookings";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getTokenFromClient } from "@/library/Action/GettingTokens/GettingTokenFromClient";

interface RequestFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: IService;
  user: ISessionUser;
}

interface RequestFormState {
  phone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
}

interface RequestFormErrors {
  phone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
}

type RequestFormErrorKey = keyof RequestFormErrors;

const todayStr = () => new Date().toISOString().slice(0, 10);

const FieldError = ({ message, id }: { message: string; id: string }) =>
  message ? (
    <p id={id} className="text-xs font-medium text-destructive" role="alert">
      {message}
    </p>
  ) : null;

export default function RequestFormModal({
  open,
  onOpenChange,
  service,
  user,
}: RequestFormModalProps) {
  const [form, setForm] = useState<RequestFormState>({
    phone: "",
    address: "",
    preferredDate: "",
    problemDescription: "",
  });
  const [errors, setErrors] = useState<RequestFormErrors>({
    phone: "",
    address: "",
    preferredDate: "",
    problemDescription: "",
  });

  const router = useRouter();
  const activeStatuses = ["requested", "accepted", "in-progress"];

  const setField = (key: RequestFormErrorKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const nextErrors: RequestFormErrors = {
      phone: "",
      address: "",
      preferredDate: "",
      problemDescription: "",
    };
    if (!form.phone.trim()) {
      nextErrors.phone = "Phone is required";
    }
    if (!form.address.trim()) {
      nextErrors.address = "Address is required";
    }
    if (!form.preferredDate) {
      nextErrors.preferredDate = "Preferred date is required";
    } else if (form.preferredDate < todayStr()) {
      nextErrors.preferredDate = "Please choose today or a future date";
    }
    if (form.problemDescription.trim().length < 20) {
      nextErrors.problemDescription =
        "Problem description must be at least 20 characters";
    }
    setErrors(nextErrors);
    return Object.values(nextErrors).every((error) => !error);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const booking: IAddBookings = {
      serviceId: service._id ?? "",
      serviceTitle: service.title,
      serviceImage: service.image,
      category: service.category,
      basePrice: service.basePrice,
      technicianName: service.technicianName,
      technicianEmail: service.technicianEmail,
      customerName: user?.name ?? "",
      customerEmail: user?.email ?? "",
      customerPhone: form.phone.trim(),
      address: form.address.trim(),
      preferredDate: new Date(form.preferredDate),
      problemDescription: form.problemDescription.trim(),
      status: "requested",
      finalAmount: service.basePrice,
      paymentStatus: "unpaid",
    };

    console.log(booking);

    const token = await getTokenFromClient();
    const result = await AddBookings(booking, token as string);
    console.log(result);

    if (result.acknowledged) {
      toast.success(`${booking.serviceTitle} is booked successfully!`, {
        position: "top-center",
      });
      router.push("/dashboard/customer/bookings");
    }

    setForm({
      phone: "",
      address: "",
      preferredDate: "",
      problemDescription: "",
    });
    setErrors({
      phone: "",
      address: "",
      preferredDate: "",
      problemDescription: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Repair — {service.title}</DialogTitle>
          <DialogDescription>
            Share the details below so we can get you scheduled.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="repair-request-name">Name</Label>
            <Input
              id="repair-request-name"
              value={user?.name ?? ""}
              readOnly
              aria-label="Your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="repair-request-email">Email</Label>
            <Input
              id="repair-request-email"
              type="email"
              value={user?.email ?? ""}
              readOnly
              aria-label="Your email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="repair-request-phone">Phone</Label>
            <Input
              id="repair-request-phone"
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
              placeholder="Where we can reach you"
              aria-invalid={Boolean(errors.phone)}
            />
            <FieldError
              message={errors.phone}
              id="repair-request-phone-error"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="repair-request-address">Address</Label>
            <Input
              id="repair-request-address"
              value={form.address}
              onChange={(e) => setField("address", e.target.value)}
              placeholder="Where the repair will happen"
              aria-invalid={Boolean(errors.address)}
            />
            <FieldError
              message={errors.address}
              id="repair-request-address-error"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="repair-request-date">Preferred date</Label>
            <Input
              id="repair-request-date"
              type="date"
              value={form.preferredDate}
              onChange={(e) => setField("preferredDate", e.target.value)}
              min={todayStr()}
              aria-invalid={Boolean(errors.preferredDate)}
            />
            <FieldError
              message={errors.preferredDate}
              id="repair-request-date-error"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="repair-request-description">
              Problem description
            </Label>
            <Textarea
              id="repair-request-description"
              value={form.problemDescription}
              onChange={(e) => setField("problemDescription", e.target.value)}
              placeholder="Tell us what’s wrong with the service…"
              rows={5}
              aria-invalid={Boolean(errors.problemDescription)}
            />
            <FieldError
              message={errors.problemDescription}
              id="repair-request-description-error"
            />
          </div>

          <div className="flex justify-end gap-2">
            <DialogClose>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Submit Request</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
