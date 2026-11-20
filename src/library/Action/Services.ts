import { ICreateServiceFormData } from "../type";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// Add Service
export const AddService = async (data: ICreateServiceFormData) => {
  const res = await fetch(`${BASE_URL}/add-service`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  return result;
};

// Get Service Created By Each Technician
export const GetServiceByTechnician = async (email: string) => {
  const res = await fetch(`${BASE_URL}/services/technician/${email}`);
  const result = await res.json();
  return result;
};

// Update availability of service
export const UpdateAvailable = async (
  id: string,
  data: { isAvailable: boolean },
) => {
  const res = await fetch(`${BASE_URL}/services/availability/${id}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ isAvailable: data.isAvailable }),
  });
  const result = await res.json();
  return result;
};
