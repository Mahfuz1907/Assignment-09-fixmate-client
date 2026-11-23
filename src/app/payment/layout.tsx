// @flow strict

import { RequireRole } from "@/library/Action/RequireRole/RequireRole";
import * as React from "react";

async function PaymentLayout({ children }: { children: React.ReactNode }) {
  await RequireRole("customer");
  return children;
}

export default PaymentLayout;
