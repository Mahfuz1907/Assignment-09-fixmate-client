import { Suspense } from "react";
import type { Metadata } from "next";
import { ManageUsersTable } from "@/components/WebComponents/Admin/Users";
import { GetUsers } from "@/library/Action/Users";
import { GettingSessionFromServer } from "@/library/GettingSessions/GetSessionServer";
import type { IUsers } from "@/library/type";

export const metadata: Metadata = {
  title: "Manage Users · FixMate Admin",
  description:
    "View all platform users and manage roles across Customer, Technician, and Admin.",
};

function normalizeUsers(payload: unknown): IUsers[] {
  if (Array.isArray(payload)) {
    return payload as IUsers[];
  }
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data: unknown }).data)
  ) {
    return (payload as { data: IUsers[] }).data;
  }
  return [];
}

function UsersTableSkeleton() {
  return (
    <div className="space-y-5 animate-pulse" aria-hidden="true">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-2xl border border-border/70 bg-card/60"
          />
        ))}
      </div>
      <div className="h-10 w-full max-w-md rounded-xl bg-muted/60" />
      <div className="h-64 rounded-2xl border border-border/70 bg-card/60" />
    </div>
  );
}

async function UsersSection() {
  const session = await GettingSessionFromServer();
  const currentAdminEmail = session?.user?.email;

  let users: IUsers[] = [];
  try {
    const rawUsers = await GetUsers();
    users = normalizeUsers(rawUsers);
  } catch (err) {
    console.error("Error loading users in admin page:", err);
  }

  return (
    <ManageUsersTable
      initialUsers={users}
      currentAdminEmail={currentAdminEmail}
    />
  );
}

export default function AllUsersPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Admin Portal
          </span>
          <span className="text-muted-foreground/40" aria-hidden="true">
            /
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-600 dark:text-amber-400">
            Manage Users
          </span>
        </div>
        <div className="mt-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              User Management
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
              Review all registered users, monitor role distributions, and
              update permissions.
            </p>
          </div>
        </div>
      </div>

      <Suspense fallback={<UsersTableSkeleton />}>
        <UsersSection />
      </Suspense>
    </div>
  );
}
