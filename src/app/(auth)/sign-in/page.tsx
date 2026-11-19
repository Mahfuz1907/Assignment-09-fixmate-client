import type { Metadata } from "next";

import { SignInForm } from "@/components/WebComponents/Auth/SignInForm";

export const metadata: Metadata = {
  title: "Sign In · FixMate",
  description:
    "Sign in to FixMate to manage your bookings, quotes and trusted home repair pros.",
};

export default function SignInPage() {
  return <SignInForm />;
}
