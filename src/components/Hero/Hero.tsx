import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-amber-500/10 via-background to-background py-14 sm:py-20 lg:py-24">
      {/* Subtle Background Glows */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-full max-w-7xl -translate-x-1/2 overflow-hidden blur-3xl opacity-30"
        aria-hidden="true"
      >
        <div className="aspect-square w-full rounded-full bg-linear-to-tr from-amber-400 to-orange-500 opacity-40" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
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
              Need Something Fixed?{" "}
              <span className="bg-linear-to-r from-amber-500 via-amber-600 to-orange-600 bg-clip-text text-transparent">
                Book a Trusted Pro Today
              </span>{" "}
            </h1>

            <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Reliable on-demand repair services for smartphones, laptops, ACs,
              refrigerators, and home appliances. Fast doorstep service or
              verified workshop drop-off with warranty.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap gap-3 lg:justify-start">
              <Button
                render={<Link href="/services" />}
                nativeButton={false}
                size="lg"
                className="gap-2 rounded-xl bg-linear-to-r from-amber-500 via-amber-600 to-orange-600 px-6 text-base font-semibold text-white shadow-md transition-all hover:from-amber-600 hover:to-orange-600"
              >
                Find Services
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="relative flex justify-center lg:col-span-5">
            <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-none">
              {/* Decorative Accent Glow */}
              <div className="absolute -inset-1.5 rounded-3xl bg-linear-to-r from-amber-500 to-orange-500 opacity-25 blur-xl" />

              {/* Hero Photo Card */}
              <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-3 shadow-2xl">
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-muted">
                  <Image
                    src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80"
                    alt="Professional repair technician working on a laptop"
                    fill
                    preload
                    sizes="(max-width: 1024px) 100vw, 480px"
                    className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

                  {/* Floating badge inside the photo */}
                  <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-background/90 p-3 backdrop-blur-md shadow">
                    <div className="text-[13px] font-semibold text-foreground">
                      Same-Day Doorstep Fix
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Pay safely after inspection &amp; repair
                    </div>
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
