import type { Metadata } from "next";

import { SignUpForm } from "@/components/WebComponents/Auth/SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up · FixMate",
  description:
    "Create your FixMate account as a customer or technician and get matched with trusted local pros.",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
