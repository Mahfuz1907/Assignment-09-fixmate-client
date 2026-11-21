import { IAddBookings } from "../type";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// Add Bookings
export const AddBookings = async (data: IAddBookings) => {
  const res = await fetch(`${BASE_URL}/add-bookings`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  });
  const result = await res.json();
  return result;
};

// Get Bookings for each customer
export const GetBookingsByCustomer = async (email: string) => {
  const res = await fetch(`${BASE_URL}/bookings/customer/${email}`);
  const result = await res.json();
  return result;
};
