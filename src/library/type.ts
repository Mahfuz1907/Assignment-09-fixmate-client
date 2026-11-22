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
  approvalStatus: string;
  isAvailable: boolean;
  createdAt: Date | string;
}

export interface IUsers {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  role: string;
  area: string;
  bio: string;
  image: string;
  phone: string;
}

export interface ISessionUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  role: string;
  area: string;
  bio: string;
  image?: string | null | undefined;
  phone: string;
}

export interface IBookings {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  category: string;
  basePrice: number;
  technicianName: string;
  technicianEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: Date;
  problemDescription: string;
  status: string;
  finalAmount: number;
  paymentStatus: string;
}

export interface IAddBookings {
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  category: string;
  basePrice: number;
  technicianName: string;
  technicianEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: Date;
  problemDescription: string;
  status: string;
  finalAmount: number;
  paymentStatus: string;
}

export interface IPayments {
  _id?: string;
  bookingId: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  technicianName: string;
  technicianEmail: string;
  amount: number;
  currency: string;
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: string;
  paidAt: Date | string;
}

export interface BookingPaymentPayload {
  paymentStatus: "paid";
  transactionId: string;
  customerEmail: string;
  amountPaid: number;
}

export interface MarkBookingPaidPayload {
  bookingId: string;
  paymentStatus?: string;
  transactionId: string;
  customerEmail?: string;
  amountPaid: number;
}
