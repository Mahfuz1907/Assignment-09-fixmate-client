import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/WebComponents/Navbar/Navbar";
import Footer from "@/components/WebComponents/Footer/Footer";
import { Toaster } from "sonner";
import { Metadata } from "next";
import LayoutComponent from "@/components/LayoutComponent/LayoutComponent";

const pjs = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "FixMate",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const pathname = usePathname();
  // const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <html
      lang="en"
      className={`${pjs.className} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <LayoutComponent>{children}</LayoutComponent>
        <Toaster />
      </body>
    </html>
  );
}
