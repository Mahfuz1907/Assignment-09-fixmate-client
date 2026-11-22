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

// Update Booking Status
export const CancelBooking = async (id: string, data: { status: string }) => {
  const res = await fetch(`${BASE_URL}/bookings/cancel/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status: data.status }),
    headers: {
      "content-type": "application/json",
    },
  });
  const result = await res.json();
  return result;
};

// Get Bookings by each Technician
export const GetBookingsByTechnician = async (email: string) => {
  const res = await fetch(`${BASE_URL}/bookings/technician/${email}`);
  const result = await res.json();
  return result;
};

// Get All Bookings
export const GetAllBookings = async () => {
  const res = await fetch(`${BASE_URL}/bookings`);
  const result = await res.json();
  return result;
};
