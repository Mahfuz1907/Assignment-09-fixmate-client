"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/WebComponents/Navbar/Navbar";
import Footer from "@/components/WebComponents/Footer/Footer";

export default function LayoutComponent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && <Navbar />}
      <main className="grow">{children}</main>
      {!isDashboard && <Footer />}
    </>
  );
}
