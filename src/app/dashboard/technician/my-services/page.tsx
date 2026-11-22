import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { MyServicesTable } from "@/components/WebComponents/Technician/MyServices/MyServicesTable";
import { Button } from "@/components/ui/button";
import { GetServiceByTechnician } from "@/library/Action/Services";
import { GettingSessionFromServer } from "@/library/GettingSessions/GetSessionServer";
import type { IService } from "@/library/type";
import { getTokenFromServer } from "@/library/Action/GettingTokens/GettingTokenFromServer";

export const metadata: Metadata = {
  title: "My Services · FixMate",
  description:
    "Manage the repair services you offer, track approval status and control availability.",
};

function normaliseServices(payload: unknown): IService[] {
  if (Array.isArray(payload)) {
    return payload as IService[];
  }

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data: unknown }).data)
  ) {
    return (payload as { data: IService[] }).data;
  }

  return [];
}

function MyServicesSkeleton() {
  return (
    <div className="space-y-5" aria-hidden="true">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex animate-pulse items-center gap-3 rounded-2xl border border-border/70 bg-card p-3.5"
          >
            <div className="size-9 shrink-0 rounded-xl bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-10 rounded bg-muted" />
              <div className="h-2.5 w-16 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
        <div className="h-14 border-b border-border/60 bg-muted/20" />
        <div className="space-y-4 p-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex animate-pulse items-center gap-3">
              <div className="size-14 shrink-0 rounded-xl bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-1/2 rounded bg-muted" />
                <div className="h-2.5 w-1/3 rounded bg-muted" />
              </div>
              <div className="h-6 w-20 rounded-full bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

async function ServicesSection() {
  const session = await GettingSessionFromServer();
  const email = session?.user?.email;

  let services: IService[] = [];
  let loadError = false;

  if (email) {
    try {
      const token = await getTokenFromServer();
      const payload = await GetServiceByTechnician(email, token);
      services = normaliseServices(payload);
    } catch {
      loadError = true;
    }
  }

  return <MyServicesTable services={services} loadError={loadError} />;
}

export default function TechnicianMyServicePage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Technician dashboard
            </span>
            <span className="text-muted-foreground/40" aria-hidden="true">
              /
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-600 dark:text-amber-400">
              My services
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            My Services
          </h1>
          <p className="mt-1 max-w-xl text-xs leading-5 text-muted-foreground sm:text-sm">
            Manage the repair services you offer, keep an eye on admin approvals
            and control what customers can book.
          </p>
        </div>

        <Button
          render={<Link href="/dashboard/technician/add-service" />}
          nativeButton={false}
          className="h-10 gap-2 self-start rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-orange-500 px-4 font-semibold text-zinc-950 shadow-[0_10px_24px_-14px_rgba(245,158,11,0.9)] hover:from-amber-300 hover:to-orange-500 sm:self-auto"
        >
          <PlusCircle className="size-4" aria-hidden="true" />
          Add Service
        </Button>
      </div>

      <Suspense fallback={<MyServicesSkeleton />}>
        <ServicesSection />
      </Suspense>
    </div>
  );
}
