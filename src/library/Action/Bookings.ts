import { IAddBookings } from "../type";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// Add Bookings
export const AddBookings = async (data: IAddBookings, token: string) => {
  const res = await fetch(`${BASE_URL}/add-bookings`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await res.json();
  return result;
};

// Get Bookings for each customer
export const GetBookingsByCustomer = async (email: string, token: string) => {
  const res = await fetch(`${BASE_URL}/bookings/customer/${email}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await res.json();
  return result;
};

// Update Booking Status
export const CancelBooking = async (
  id: string,
  data: { status: string },
  token: string,
) => {
  const res = await fetch(`${BASE_URL}/bookings/cancel/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status: data.status }),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await res.json();
  return result;
};

// Get Bookings by each Technician
export const GetBookingsByTechnician = async (email: string, token: string) => {
  const res = await fetch(`${BASE_URL}/bookings/technician/${email}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await res.json();
  return result;
};

// Get All Bookings
export const GetAllBookings = async (token: string) => {
  const res = await fetch(`${BASE_URL}/bookings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await res.json();
  return result;
};
