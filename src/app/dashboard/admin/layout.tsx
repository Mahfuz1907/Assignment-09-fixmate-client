// @flow strict

import { RequireRole } from "@/library/Action/RequireRole/RequireRole";
import * as React from "react";

async function AdminLayout({ children }: { children: React.ReactNode }) {
  await RequireRole("admin");
  return children;
}

export default AdminLayout;
