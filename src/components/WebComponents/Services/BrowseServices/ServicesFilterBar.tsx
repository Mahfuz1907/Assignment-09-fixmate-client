"use client";

import { useTransition } from "react";
import type { FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, RotateCcw, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DEFAULT_SORT,
  SERVICE_CATEGORIES,
  SERVICE_MODES,
  SORT_OPTIONS,
} from "./filters";

const ALL = "all";

const CATEGORY_ITEMS = [
  { value: ALL, label: "All categories" },
  ...SERVICE_CATEGORIES.map((category) => ({
    value: category,
    label: category,
  })),
];

const MODE_ITEMS = [
  { value: ALL, label: "All service modes" },
  ...SERVICE_MODES.map((mode) => ({ value: mode, label: mode })),
];

const SORT_ITEMS = SORT_OPTIONS.map((option) => ({
  value: option.value,
  label: option.label,
}));

export function ServicesFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const searchTerm = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? ALL;
  const serviceMode = searchParams.get("serviceMode") ?? ALL;
  const sort = searchParams.get("sort") ?? DEFAULT_SORT;

  const updateParams = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || (key === "sort" && value === DEFAULT_SORT)) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });

    const queryString = next.toString();
    startTransition(() => {
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    });
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = String(
      new FormData(event.currentTarget).get("search") ?? "",
    ).trim();
    updateParams({ search: value || null });
  };

  const hasFilters =
    Boolean(searchTerm.trim()) ||
    category !== ALL ||
    serviceMode !== ALL ||
    sort !== DEFAULT_SORT;

  const clearFilters = () => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-xs sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="min-w-0 flex-1">
          <Label
            htmlFor="service-search"
            className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
          >
            <Search className="size-3.5" aria-hidden="true" />
            Search services
          </Label>
          <form
            role="search"
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2"
          >
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                // Remount when the URL value changes (submit, clear, back/forward).
                key={searchTerm}
                id="service-search"
                name="search"
                type="search"
                defaultValue={searchTerm}
                placeholder="Search by title or category…"
                className="h-10 rounded-xl pl-9 pr-9"
              />
              {isPending ? (
                <Loader2
                  className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-amber-500"
                  aria-hidden="true"
                />
              ) : null}
            </div>
            <Button
              type="submit"
              variant="outline"
              className="h-10 shrink-0 rounded-xl border-border/70 px-3.5 text-xs font-semibold"
            >
              Search
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-auto">
          <div className="lg:w-44">
            <Label
              id="filter-category-label"
              className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Category
            </Label>
            <Select
              items={CATEGORY_ITEMS}
              value={category}
              onValueChange={(value) =>
                updateParams({ category: value === ALL ? null : value })
              }
            >
              <SelectTrigger
                aria-labelledby="filter-category-label"
                className="h-10 w-full rounded-xl border-border/70"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_ITEMS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="lg:w-44">
            <Label
              id="filter-mode-label"
              className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Service mode
            </Label>
            <Select
              items={MODE_ITEMS}
              value={serviceMode}
              onValueChange={(value) =>
                updateParams({ serviceMode: value === ALL ? null : value })
              }
            >
              <SelectTrigger
                aria-labelledby="filter-mode-label"
                className="h-10 w-full rounded-xl border-border/70"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MODE_ITEMS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="lg:w-44">
            <Label
              id="filter-sort-label"
              className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
            >
              <SlidersHorizontal className="size-3.5" aria-hidden="true" />
              Sort by
            </Label>
            <Select
              items={SORT_ITEMS}
              value={sort}
              onValueChange={(value) => updateParams({ sort: value })}
            >
              <SelectTrigger
                aria-labelledby="filter-sort-label"
                className="h-10 w-full rounded-xl border-border/70"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_ITEMS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] text-muted-foreground">
          Search, filters and sorting run on the server and stay in the URL, so
          you can share or reload this page.
        </p>
        {hasFilters ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 gap-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Clear all filters
          </Button>
        ) : null}
      </div>
    </div>
  );
}
