import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, SearchX, TriangleAlert, Wrench } from "lucide-react";

import { ServiceBrowseCard } from "@/components/WebComponents/Services/BrowseServices/ServiceBrowseCard";
import { ServicesFilterBar } from "@/components/WebComponents/Services/BrowseServices/ServicesFilterBar";
import {
  DEFAULT_SORT,
  isServiceCategory,
  isServiceMode,
  isSortValue,
} from "@/components/WebComponents/Services/BrowseServices/filters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { IService, ServiceCategory, ServiceMode } from "@/library/type";
import { GetAllServicesByQuery } from "@/library/Action/Services";

export const metadata: Metadata = {
  title: "Browse Services · FixMate",
  description:
    "Browse approved repair services from verified technicians. Filter by category and service mode, search by title, and sort by price or newest.",
};

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

type SearchParams = Record<string, string | string[] | undefined>;

type BrowseQuery = {
  search: string;
  category?: ServiceCategory;
  serviceMode?: ServiceMode;
  sort: typeof DEFAULT_SORT | "price-asc" | "price-desc";
};

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseQuery(params: SearchParams): BrowseQuery {
  const search = readParam(params.search)?.trim() ?? "";
  const categoryParam = readParam(params.category);
  const serviceModeParam = readParam(params.serviceMode);
  const sortParam = readParam(params.sort);

  return {
    search,
    category: isServiceCategory(categoryParam) ? categoryParam : undefined,
    serviceMode: isServiceMode(serviceModeParam) ? serviceModeParam : undefined,
    sort: isSortValue(sortParam) ? sortParam : DEFAULT_SORT,
  };
}

function buildApiQuery(query: BrowseQuery) {
  const params = new URLSearchParams();

  if (query.search) params.set("search", query.search);
  if (query.category) params.set("category", query.category);
  if (query.serviceMode) params.set("serviceMode", query.serviceMode);

  if (query.sort === "price-asc" || query.sort === "price-desc") {
    params.set("sortBy", "basePrice");
    params.set("sortOrder", query.sort === "price-desc" ? "desc" : "asc");
  } else {
    params.set("sortBy", "createdAt");
    params.set("sortOrder", "desc");
  }

  return params.toString();
}

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

async function getBrowseServices(query: BrowseQuery): Promise<IService[]> {
  const res = await GetAllServicesByQuery(buildApiQuery(query));

  return normaliseServices(res);
}

function ServicesSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <div className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex-1 space-y-2">
            <div className="h-2.5 w-24 animate-pulse rounded bg-muted" />
            <div className="h-10 w-full animate-pulse rounded-xl bg-muted" />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2 lg:w-44">
                <div className="h-2.5 w-16 animate-pulse rounded bg-muted" />
                <div className="h-10 w-full animate-pulse rounded-xl bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-border/70 bg-card"
          >
            <div className="aspect-16/10 w-full animate-pulse bg-muted" />
            <div className="space-y-3 p-4">
              <div className="h-3.5 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-2.5 w-1/2 animate-pulse rounded bg-muted" />
              <div className="h-2.5 w-2/3 animate-pulse rounded bg-muted" />
              <div className="h-9 w-full animate-pulse rounded-xl bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card px-6 py-20 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-amber-400/20 to-orange-500/10 text-amber-600 ring-1 ring-amber-500/20 dark:text-amber-400">
        <SearchX className="size-7" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-base font-bold tracking-tight">
        {hasFilters ? "No services match your filters" : "No services yet"}
      </h2>
      <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
        {hasFilters
          ? "Try a different category, service mode or search term — or clear the filters to see everything that's available."
          : "No approved and available services right now. Check back soon — our technicians are adding new repairs every week."}
      </p>
      {hasFilters ? (
        <Button
          render={<Link href="/services" />}
          nativeButton={false}
          className="mt-5 h-10 gap-2 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-orange-500 px-4 font-semibold text-zinc-950 shadow-[0_10px_24px_-14px_rgba(245,158,11,0.9)] hover:from-amber-300 hover:to-orange-500"
        >
          Clear filters
        </Button>
      ) : null}
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-500/25 bg-rose-500/5 px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 ring-1 ring-rose-500/20 dark:text-rose-400">
        <TriangleAlert className="size-7" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-base font-bold tracking-tight">
        We couldn&apos;t load the services
      </h2>
      <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
        The service API didn&apos;t respond. Check the server and try again.
      </p>
      <Button
        render={<Link href="/services" />}
        nativeButton={false}
        variant="outline"
        className="mt-5 h-10 gap-2 rounded-xl border-border/70 px-4 font-semibold"
      >
        Try again
      </Button>
    </div>
  );
}

async function ServicesResults({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const query = parseQuery(params);

  const hasFilters = Boolean(
    query.search ||
    query.category ||
    query.serviceMode ||
    query.sort !== DEFAULT_SORT,
  );

  let services: IService[] = [];
  let failed = false;

  try {
    services = await getBrowseServices(query);
  } catch {
    failed = true;
  }

  return (
    <div className="space-y-6">
      <ServicesFilterBar />

      {failed ? (
        <ErrorState />
      ) : services.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        <section className="space-y-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <strong className="font-semibold text-foreground">
                {services.length}
              </strong>{" "}
              available service{services.length === 1 ? "" : "s"}
              {query.search ? (
                <>
                  {" "}
                  for{" "}
                  <span className="font-medium text-foreground">
                    &ldquo;{query.search}&rdquo;
                  </span>
                </>
              ) : null}
            </p>
            <p className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
              <BadgeCheck
                className="size-3.5 text-emerald-600 dark:text-emerald-400"
                aria-hidden="true"
              />
              Approved &amp; available only
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service, index) => (
              <ServiceBrowseCard
                key={service._id ?? `${service.title}-${index}`}
                service={service}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border/70 bg-linear-to-br from-amber-500/10 via-background to-background dark:from-amber-500/5">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <Badge
            variant="outline"
            className="gap-1.5 rounded-full border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300"
          >
            <Wrench className="size-3" aria-hidden="true" />
            Verified technicians
          </Badge>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Browse Services
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Find the right repair pro for the job. Every listing below is
            approved by our team and ready to book — search, filter and sort to
            narrow things down.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <Suspense fallback={<ServicesSkeleton />}>
          <ServicesResults searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
