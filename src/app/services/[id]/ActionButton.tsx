"use client";

import { Button } from "@/components/ui/button";
import { IBookings, IService, ISessionUser } from "@/library/type";
import { ArrowRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RequestFormModal from "./RequestFormModal";
import { toast } from "sonner";
import { getTokenFromClient } from "@/library/Action/GettingTokens/GettingTokenFromClient";
import { GetBookingsByCustomer } from "@/library/Action/Bookings";

interface ActionButtonType {
  service: IService;
  user: ISessionUser;
}

const ActionButton = ({ service, user }: ActionButtonType) => {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [allBookings, setAllBookings] = useState([]);

  const activeStatuses = ["requested", "accepted", "in-progress"];

  useEffect(() => {
    const fetchBookings = async () => {
      const token = await getTokenFromClient();
      const result = await GetBookingsByCustomer(
        user?.email as string,
        token as string,
      );

      setAllBookings(result);
    };
    fetchBookings();
  }, [user]);

  const isAlreadyBooked = allBookings.some(
    (book: IBookings) =>
      book.serviceId === service._id && activeStatuses.includes(book.status),
  );

  const handleButton = () => {
    if (!user) {
      router.push(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (isAlreadyBooked) {
      toast.info(`You already have an active request for ${service.title}!`, {
        position: "top-center",
      });
      return;
    }
    if (user?.role === "customer") {
      setOpen(true);
    }
  };

  return (
    <>
      <Button
        onClick={handleButton}
        type="button"
        disabled={user?.role === "admin" || user?.role === "technician"}
        aria-disabled={isAlreadyBooked}
        className="mt-5 h-11 w-full gap-2 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-orange-500 text-sm font-semibold text-zinc-950 shadow-[0_10px_24px_-14px_rgba(245,158,11,0.9)] hover:from-amber-300 hover:to-orange-500"
      >
        {user?.role === "admin" || user?.role === "technician"
          ? "Only customers can request a repair"
          : isAlreadyBooked
            ? "Repair Requested"
            : "Request Repair"}
        {user?.role === "admin" ||
        user?.role === "technician" ||
        isAlreadyBooked ? (
          ""
        ) : (
          <ArrowRight className="size-4" aria-hidden="true" />
        )}
      </Button>
      <RequestFormModal
        open={open}
        onOpenChange={setOpen}
        service={service}
        user={user}
      />
    </>
  );
};

export default ActionButton;
