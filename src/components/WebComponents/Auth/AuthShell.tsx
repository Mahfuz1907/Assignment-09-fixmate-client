import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  ShieldCheck,
  Star,
  Wrench,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";

function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-amber-400 via-amber-500 to-orange-500 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_6px_16px_-8px_rgba(245,158,11,0.9)] transition-transform duration-300 group-hover:-rotate-6",
        className,
      )}
    >
      <Wrench className="size-5" strokeWidth={2.4} aria-hidden="true" />
      <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-zinc-950 bg-emerald-500" />
    </span>
  );
}

const HIGHLIGHTS = [
  {
    icon: BadgeCheck,
    title: "Vetted local pros",
    description: "Background-checked and reviewed by real homeowners.",
  },
  {
    icon: Zap,
    title: "Booked in minutes",
    description: "Pick a slot that fits your day — same-day options available.",
  },
  {
    icon: ShieldCheck,
    title: "Fixed-price promise",
    description: "Upfront quotes and no surprise call-out fees. Ever.",
  },
] as const;

function BrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 p-9 text-zinc-300 shadow-[0_40px_100px_-60px_rgba(0,0,0,0.9)] lg:flex lg:flex-col lg:justify-between xl:p-10">
      {/* Ambient decoration */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 size-72 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 size-80 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_75%)]" />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-500/70 to-transparent"
      />

      <div className="relative">
        <Link
          href="/"
          aria-label="FixMate home"
          className="group inline-flex w-fit items-center gap-3 rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-amber-500/40"
        >
          <BrandMark />
          <span className="flex flex-col leading-none">
            <span className="text-xl font-extrabold tracking-tight text-white">
              Fix<span className="text-amber-400">Mate</span>
            </span>
            <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Home repair pros
            </span>
          </span>
        </Link>

        <h2 className="mt-10 text-3xl font-bold leading-[1.1] tracking-tight text-white xl:text-4xl">
          Less hassle.
          <br />
          <span className="bg-linear-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
            More home.
          </span>
        </h2>
        <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-400">
          From leaky taps to full rewires — FixMate connects you with pros who
          show up, quote honestly and get it done.
        </p>

        <ul className="mt-8 flex flex-col gap-5">
          {HIGHLIGHTS.map((highlight) => {
            const HighlightIcon = highlight.icon;

            return (
              <li key={highlight.title} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-amber-400">
                  <HighlightIcon className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {highlight.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-5 text-zinc-400">
                    {highlight.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="relative mt-10">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-center gap-0.5 text-amber-400">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className="size-3.5 fill-current"
                aria-hidden="true"
              />
            ))}
            <span className="ml-1.5 text-[11px] font-semibold text-zinc-300">
              4.9 average
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-zinc-300">
            &ldquo;Booked a plumber at 9am, leak fixed by lunch. The price I was
            quoted was the price I paid.&rdquo;
          </p>
          <div className="mt-3 flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-full bg-linear-to-br from-amber-400 to-orange-500 text-[11px] font-bold text-zinc-950">
              AM
            </span>
            <div>
              <p className="text-xs font-semibold text-white">Amelia M.</p>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                Austin, TX
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 transition-colors hover:text-amber-300"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to home
        </Link>
      </div>
    </aside>
  );
}

function MobileBrand() {
  return (
    <div className="mb-6 flex items-center justify-between gap-4 lg:hidden">
      <Link
        href="/"
        aria-label="FixMate home"
        className="group inline-flex items-center gap-2.5 rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-amber-500/40"
      >
        <BrandMark className="size-9 rounded-xl" />
        <span className="text-lg font-extrabold tracking-tight">
          Fix<span className="text-amber-600 dark:text-amber-400">Mate</span>
        </span>
      </Link>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Home
      </Link>
    </div>
  );
}

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <section className="relative isolate pb-16 pt-8 sm:pt-10 lg:pb-24 lg:pt-12">
      {/* Page backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-32 left-1/2 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-amber-400/20 blur-3xl dark:bg-amber-500/10" />
        <div className="absolute -bottom-24 right-0 size-72 rounded-full bg-orange-300/10 blur-3xl" />
        <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(0,0,0,0.07)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_65%)] dark:opacity-[0.18] dark:[background-image:radial-gradient(rgba(255,255,255,0.14)_1px,transparent_1px)]" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-stretch gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26.5rem)] lg:gap-10 lg:px-8 xl:gap-14">
        <BrandPanel />

        <div className="mx-auto w-full max-w-md lg:max-w-none">
          <MobileBrand />
          {children}
        </div>
      </div>
    </section>
  );
}
