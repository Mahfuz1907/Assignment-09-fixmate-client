"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Smartphone,
  Laptop,
  Wind,
  Refrigerator,
  Tv,
  WashingMachine,
  Zap,
  ShieldCheck,
  Award,
  Wallet,
  Clock,
  ArrowRight,
  Star,
  CheckCircle,
} from "lucide-react";
import type { ServiceCategory } from "@/library/type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryItem {
  id: ServiceCategory;
  name: string;
  icon: React.ElementType;
  count: string;
  description: string;
  color: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "Smartphone",
    name: "Smartphone",
    icon: Smartphone,
    count: "15+ Services",
    description: "Screen replacement, battery issues, port repair & water damage fix.",
    color: "from-sky-500 to-blue-600",
  },
  {
    id: "Laptop & PC",
    name: "Laptop & PC",
    icon: Laptop,
    count: "20+ Services",
    description: "OS installation, hardware upgrade, motherboard chip fix & cleaning.",
    color: "from-indigo-500 to-purple-600",
  },
  {
    id: "AC",
    name: "AC",
    icon: Wind,
    count: "12+ Services",
    description: "Master jet cleaning, gas charging, compressor repair & installation.",
    color: "from-teal-500 to-cyan-600",
  },
  {
    id: "Refrigerator",
    name: "Refrigerator",
    icon: Refrigerator,
    count: "8+ Services",
    description: "Cooling diagnostics, thermostat replacement & compressor fix.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "TV",
    name: "TV",
    icon: Tv,
    count: "10+ Services",
    description: "LED/OLED backlight repair, motherboard repair & sound fixing.",
    color: "from-purple-500 to-pink-600",
  },
  {
    id: "Washing Machine",
    name: "Washing Machine",
    icon: WashingMachine,
    count: "9+ Services",
    description: "Motor repair, drainage unblocking & drum noise fixing.",
    color: "from-emerald-500 to-green-600",
  },
  {
    id: "Electrical",
    name: "Electrical",
    icon: Zap,
    count: "18+ Services",
    description: "Circuit breaker fixing, switch wiring, short circuit troubleshooting.",
    color: "from-amber-500 to-orange-600",
  },
];

const TRUST_POINTS = [
  {
    icon: ShieldCheck,
    title: "100% Verified Technicians",
    description: "Every pro undergoes rigorous background checks and technical skillset evaluation before joining.",
  },
  {
    icon: Wallet,
    title: "Pay After Service",
    description: "Zero advance payments required. Inspect the completed repair thoroughly before releasing payment.",
  },
  {
    icon: Award,
    title: "Service Warranty",
    description: "Enjoy up to 90 days guaranteed repair warranty on replacement parts and labor.",
  },
  {
    icon: Clock,
    title: "Fast 60-Min Response",
    description: "Get prompt response times and on-time doorstep technician arrival.",
  },
];

const STATS = [
  { label: "Verified Technicians", value: "350+" },
  { label: "Repairs Completed", value: "28,000+" },
  { label: "Satisfied Customers", value: "99.2%" },
  { label: "Avg Service Rating", value: "4.9 / 5" },
];

const TESTIMONIALS = [
  {
    name: "Tanvir Rahman",
    role: "MacBook User",
    comment:
      "Technician fixed my MacBook screen on the same day right at my home. Outstanding professionalism and fair pricing!",
    rating: 5,
  },
  {
    name: "Ayesha Siddiqua",
    role: "Homeowner",
    comment:
      "Our inverter AC was not cooling. The FixMate technician came within 2 hours and performed jet cleaning. Highly recommended!",
    rating: 5,
  },
];

export function CategoriesAndWhyUs() {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>("Smartphone");

  const activeCategoryData = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section 1: Popular Categories */}
        <div className="text-center">
          <Badge
            variant="outline"
            className="mb-3 inline-flex items-center gap-1 rounded-full border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400"
          >
            Diverse Solutions
          </Badge>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Popular Repair Categories
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Select a category to view specialized solutions or browse all matching verified services.
          </p>
        </div>

        {/* Category Pills/Cards */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`group flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                  isSelected
                    ? "border-amber-500 bg-amber-500/10 shadow-md ring-1 ring-amber-500/50"
                    : "border-border/70 bg-card hover:border-amber-500/40 hover:bg-muted/40"
                }`}
              >
                <div
                  className={`flex size-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110 ${
                    isSelected
                      ? "bg-amber-500 text-white"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <Icon className="size-5" />
                </div>
                <span className="mt-2.5 text-xs font-bold leading-tight text-foreground">
                  {cat.name}
                </span>
                <span className="mt-0.5 text-[10px] text-muted-foreground">
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Category Preview Banner */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-card to-card p-6 shadow-sm">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
                <activeCategoryData.icon className="size-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-foreground">
                    {activeCategoryData.name} Repair & Maintenance
                  </h3>
                  <Badge variant="outline" className="border-amber-500/40 text-amber-700 dark:text-amber-400 text-[10px]">
                    {activeCategoryData.count}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {activeCategoryData.description}
                </p>
              </div>
            </div>

            <Link href={`/services?category=${encodeURIComponent(activeCategoryData.name)}`}>
              <Button className="shrink-0 rounded-xl bg-amber-500 font-semibold text-white hover:bg-amber-600 text-xs sm:text-sm">
                Browse {activeCategoryData.name} Services
                <ArrowRight className="ml-1.5 size-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Section 2: Why Choose Us (Platform Stats + Trust Points + Testimonials) */}
        <div className="mt-24 border-t border-border/70 pt-16">
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="outline"
              className="mb-3 inline-flex items-center gap-1 rounded-full border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400"
            >
              <Award className="size-3.5" />
              Why FixMate
            </Badge>
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Why Thousands Trust FixMate
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              We take the stress out of appliance breakdowns with certified experts, verified pricing, and satisfaction guarantee.
            </p>
          </div>

          {/* Platform Stats Grid */}
          <div className="mt-12 grid grid-cols-2 gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-xs sm:grid-cols-4 sm:p-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-black text-amber-600 dark:text-amber-400 sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Trust Points (4 Key Pillars) */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_POINTS.map((point) => {
              const Icon = point.icon;
              return (
                <Card
                  key={point.title}
                  className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs transition-all duration-300 hover:shadow-md hover:border-amber-500/40"
                >
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {point.description}
                  </p>
                </Card>
              );
            })}
          </div>

          {/* Customer Testimonials Snapshot */}
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
            {TESTIMONIALS.map((t) => (
              <Card
                key={t.name}
                className="rounded-2xl border border-border/70 bg-muted/20 p-6 shadow-xs"
              >
                <CardContent className="p-0">
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="italic text-sm text-foreground leading-relaxed">
                    &ldquo;{t.comment}&rdquo;
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{t.name}</h4>
                      <p className="text-[11px] text-muted-foreground">{t.role}</p>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="size-3.5" />
                      Verified Customer
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategoriesAndWhyUs;
