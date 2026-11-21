import { ICreateServiceEditData, ICreateServiceFormData } from "../type";

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

// Edit Service
export const EditService = async (id: string, data: ICreateServiceEditData) => {
  const res = await fetch(`${BASE_URL}/service/edit/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  });
  const result = await res.json();
  return result;
};

// Delete Service
export const DeleteService = async (id: string) => {
  const res = await fetch(`${BASE_URL}/service/delete/${id}`, {
    method: "DELETE",
  });
  const result = await res.json();
  return result;
};

// Get all Services for admin
export const GetAllServices = async (query = "") => {
  const res = await fetch(`${BASE_URL}/all-services?${query}`);
  const result = await res.json();
  return result;
};

// Update Service Status
export const UpdateStatus = async (
  id: string,
  data: { approvalStatus: string },
) => {
  const res = await fetch(`${BASE_URL}/services/update-status/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ approvalStatus: data.approvalStatus }),
    headers: {
      "content-type": "application/json",
    },
  });
  const result = await res.json();
  return result;
};

// Get all service by query available approved
export const GetAllServicesByQuery = async (query: string) => {
  const res = await fetch(`${BASE_URL}/services/available-approved?${query}`);
  const result = await res.json();
  return result;
};

// Get Service Details
export const GetServiceDetails = async (id: string) => {
  const res = await fetch(`${BASE_URL}/service/${id}`);
  const result = await res.json();
  return result;
};
