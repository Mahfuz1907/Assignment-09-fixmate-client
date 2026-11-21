import type { ServiceCategory, ServiceMode } from "@/library/type";

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

export const SERVICE_MODES: ServiceMode[] = ["Home Visit", "Shop Drop-off"];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export const DEFAULT_SORT: SortValue = "newest";

export function isServiceCategory(
  value: string | undefined,
): value is ServiceCategory {
  return SERVICE_CATEGORIES.includes(value as ServiceCategory);
}

export function isServiceMode(value: string | undefined): value is ServiceMode {
  return SERVICE_MODES.includes(value as ServiceMode);
}

export function isSortValue(value: string | undefined): value is SortValue {
  return SORT_OPTIONS.some((option) => option.value === value);
}
