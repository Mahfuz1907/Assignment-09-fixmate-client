export type ServiceCategory =
  | "Smartphone"
  | "Laptop & PC"
  | "AC"
  | "Refrigerator"
  | "TV"
  | "Washing Machine"
  | "Electrical";

export type ServiceMode = "Home Visit" | "Shop Drop-off";

export type ServiceApprovalStatus = "pending" | "approved" | "rejected";

export interface IService {
  _id?: string;
  title: string;
  category: ServiceCategory;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: ServiceMode;
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: ServiceApprovalStatus;
  isAvailable: boolean;
  createdAt: string | Date;
}

export interface ICreateServiceInput {
  title: string;
  category: ServiceCategory;
  description: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: ServiceMode;
  serviceArea: string;
  serviceImage: File | null;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: ServiceApprovalStatus;
  isAvailable: boolean;
}

export interface ICreateServiceFormData {
  title: string;
  category: ServiceCategory;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: ServiceMode;
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: "pending";
  isAvailable: boolean;
  createdAt: Date | string;
}

export interface ICreateServiceEditData {
  title: string;
  category: ServiceCategory;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: ServiceMode;
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: ServiceApprovalStatus;
  isAvailable: boolean;
  createdAt: Date | string;
}
