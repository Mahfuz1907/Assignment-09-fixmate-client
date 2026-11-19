"use client";

import type { ReactNode } from "react";
import { DashboardSidebarLayout } from "@/components/WebComponents/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardSidebarLayout>{children}</DashboardSidebarLayout>;
}
