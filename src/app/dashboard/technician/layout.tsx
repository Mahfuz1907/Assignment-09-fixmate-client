// @flow strict

import { RequireRole } from "@/library/Action/RequireRole/RequireRole";
import * as React from "react";

async function TechnicianLayout({ children }: { children: React.ReactNode }) {
  await RequireRole("technician");
  return children;
}

export default TechnicianLayout;
