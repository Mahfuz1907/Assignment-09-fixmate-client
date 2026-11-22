"use client";

import { GivePayment } from "@/library/Action/Payment";
import { useState } from "react";
import { Button } from "../ui/button";

type PayBookingButtonProps = {
  bookingId: string;
  amount: number;
};

export default function PayBookingButton({
  bookingId,
  amount,
}: PayBookingButtonProps) {
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    setError("");

    try {
      const data = await GivePayment(bookingId, amount);

      if (!data.ok || data.error) {
        setError(data.error || "Payment can't be started");

        return;
      }

      if (data.url) {
        window.location.assign(data.url);
      }
    } catch {
      setError("Facing Problem Connecting to Server");
    }
  };

  return (
    <div>
      <Button type="button" onClick={handleCheckout} className="h-8 gap-1">
        Pay ${amount} Now
      </Button>
      {error && <p>{error}</p>}
    </div>
  );
}
