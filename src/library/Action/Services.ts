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
