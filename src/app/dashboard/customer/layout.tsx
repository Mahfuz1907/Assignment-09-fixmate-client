// @flow strict

import { RequireRole } from "@/library/Action/RequireRole/RequireRole";
import * as React from "react";

async function CustomerLayout({ children }: { children: React.ReactNode }) {
  await RequireRole("customer");
  return children;
}

export default CustomerLayout;
