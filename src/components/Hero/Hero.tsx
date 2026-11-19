"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShieldCheck, Sparkles, Star, Users, Wrench, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/services");
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-background to-background py-14 sm:py-20 lg:py-24">
      {/* Subtle Background Glows */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-full max-w-7xl -translate-x-1/2 overflow-hidden blur-3xl opacity-30"
        aria-hidden="true"
      >
        <div className="aspect-square w-full rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 opacity-40" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Text / Action Content */}
          <div className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left">
            <Badge
              variant="outline"
              className="mb-5 inline-flex items-center gap-1.5 rounded-full border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400"
            >
              <Sparkles className="size-3.5" />
              #1 Trusted Home & Device Repair Network
            </Badge>

            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Broken Device?{" "}
              <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 bg-clip-text text-transparent">
                Get It Fixed
              </span>{" "}
              by Verified Technicians.
            </h1>

            <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Reliable on-demand repair services for smartphones, laptops, ACs, refrigerators, and home appliances. Fast doorstep service or verified workshop drop-off with warranty.
            </p>

            {/* Search Box & CTA */}
            <form
              onSubmit={handleSearch}
              className="mt-8 flex w-full max-w-xl flex-col gap-3 rounded-2xl border border-border/80 bg-card/80 p-2 shadow-lg backdrop-blur-md sm:flex-row sm:items-center sm:gap-2"
            >
              <div className="relative flex flex-1 items-center pl-3">
                <Search className="size-5 text-muted-foreground" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search device, AC, laptop repair..."
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0 text-foreground placeholder:text-muted-foreground text-sm sm:text-base"
                />
              </div>

              <Button
                type="submit"
                className="h-11 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 font-semibold text-white shadow-md transition-all hover:from-amber-600 hover:to-orange-600"
              >
                Find Services
                <ArrowRight className="ml-1.5 size-4" />
              </Button>
            </form>

            {/* Quick Suggestions & Trust Metrics */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground lg:justify-start">
              <span className="font-medium">Popular:</span>
              {["iPhone Screen", "Laptop Battery", "AC Servicing", "Refrigerator Gas"].map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => router.push(`/services?search=${encodeURIComponent(item)}`)}
                    className="rounded-full bg-muted/80 px-2.5 py-0.5 transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {item}
                  </button>
                )
              )}
            </div>

            {/* Social Proof Badges */}
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-border/60 pt-6 sm:gap-8">
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-1.5 font-bold text-foreground text-lg sm:text-2xl">
                  <ShieldCheck className="size-5 text-amber-500" />
                  <span>100%</span>
                </div>
                <span className="text-xs text-muted-foreground">Verified Pros</span>
              </div>

              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-1.5 font-bold text-foreground text-lg sm:text-2xl">
                  <Star className="size-5 fill-amber-400 text-amber-400" />
                  <span>4.9 / 5</span>
                </div>
                <span className="text-xs text-muted-foreground">Customer Rating</span>
              </div>

              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-1.5 font-bold text-foreground text-lg sm:text-2xl">
                  <Users className="size-5 text-amber-500" />
                  <span>25k+</span>
                </div>
                <span className="text-xs text-muted-foreground">Repairs Done</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual / Illustration */}
          <div className="relative flex justify-center lg:col-span-5">
            <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-none">
              {/* Decorative Accent Glow */}
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 opacity-25 blur-xl" />

              {/* Main Card with Image */}
              <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-3 shadow-2xl">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted">
                  <Image
                    src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80"
                    alt="Professional repair technician fixing modern hardware"
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    priority
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Floating Highlight inside image */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-background/90 p-3 backdrop-blur-md">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
                        <Wrench className="size-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold leading-tight text-foreground">Same-Day Doorstep Fix</p>
                        <p className="text-[11px] text-muted-foreground">Pay safely after inspection & repair</p>
                      </div>
                    </div>
                    <Link href="/services">
                      <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs font-medium">
                        Explore
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
