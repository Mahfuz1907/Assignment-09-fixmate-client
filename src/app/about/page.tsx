import Link from "next/link";
import {
  Check,
  Clock,
  Search,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works / About · FixMate",
  description:
    "How FixMate works: request a repair, we match a technician, and the job gets done.",
};

interface StepItem {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
  accentClass: string;
  iconClass: string;
}

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
  accentClass: string;
}

const STEPS: StepItem[] = [
  {
    number: "01",
    icon: Search,
    title: "Report the issue",
    description:
      "Tell us what’s broken, the device or appliance involved, and when you need it back — then we take it from there.",
    accentClass:
      "bg-linear-to-br from-sky-500/15 to-sky-500/5 text-sky-600 dark:text-sky-400",
    iconClass: "border border-sky-500/25 bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  {
    number: "02",
    icon: Users,
    title: "We match a technician",
    description:
      "Our platform connects you with a licensed and verified technician in your area within hours — no more endless waiting.",
    accentClass:
      "bg-linear-to-br from-emerald-500/15 to-emerald-500/5 text-emerald-600 dark:text-emerald-400",
    iconClass: "border border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    number: "03",
    icon: Check,
    title: "Repair completed",
    description:
      "The work is done, you confirm the result, and payment only goes through once everything checks out.",
    accentClass:
      "bg-linear-to-br from-amber-500/15 to-amber-500/5 text-amber-600 dark:text-amber-400",
    iconClass: "border border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
];

const FEATURES: FeatureItem[] = [
  {
    icon: ShieldCheck,
    title: "Licensed & insured technicians",
    description:
      "Every pro is vetted by the FixMate team before they join the network.",
    accentClass: "text-sky-600 dark:text-sky-400",
  },
  {
    icon: Clock,
    title: "Fast matching, no waiting lines",
    description:
      "Requests are picked up as they come in, so you can expect a match quickly.",
    accentClass: "text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: Wrench,
    title: "Transparent pricing",
    description:
      "Upfront prices from your technician — no hidden fees before you agree to anything.",
    accentClass: "text-amber-600 dark:text-amber-400",
  },
];

function StepCard({ step }: { step: StepItem }) {
  const Icon = step.icon;
  return (
    <Card className="border-border/70 shadow-sm">
      <CardContent className="flex flex-col gap-4 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span
            className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${step.iconClass}`}
          >
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <Badge
            variant="outline"
            className={`mt-0.5 shrink-0 border-border/70 px-2.5 text-[10px] font-semibold text-muted-foreground`}
          >
            {step.number}
          </Badge>
        </div>
        <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
        <p className="text-sm leading-6 text-muted-foreground">
          {step.description}
        </p>
      </CardContent>
    </Card>
  );
}

function FeatureCard({ feature }: { feature: FeatureItem }) {
  const Icon = feature.icon;
  return (
    <Card className="border-border/70 shadow-sm">
      <CardContent className="flex flex-col gap-3 p-6 sm:p-8">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted/60 ${feature.accentClass}`}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <h3 className="text-base font-bold text-foreground">
          {feature.title}
        </h3>
        <p className="text-sm leading-6 text-muted-foreground">
          {feature.description}
        </p>
      </CardContent>
    </Card>
  );
}

const AboutPage = () => {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
      {/* Hero */}
      <div className="space-y-3">
        <Badge
          variant="outline"
          className="rounded-full border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-400"
        >
          How it works
        </Badge>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          A Simple Way to Fix Things{" "}
          <span className="bg-linear-to-r from-amber-400 via-amber-500 to-orange-500 bg-clip-text text-transparent">
            the Right Way
          </span>
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          FixMate is the marketplace that connects people with reliable,
          licensed technicians for repair, maintenance, and installation —
          quickly, transparently, and without the hassle of searching.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            The process in three steps
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            From request to repaired home in minutes.
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {STEPS.map((step) => (
            <StepCard key={step.number} step={step} />
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Why FixMate?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Built for peace of mind, not last-minute surprises.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="pt-2">
        <Button
          render={<Link href="/services" />}
          nativeButton={false}
          className="h-11 gap-2 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-orange-500 px-5 font-semibold text-zinc-950 shadow-[0_10px_24px_-14px_rgba(245,158,11,0.9)] hover:from-amber-300 hover:to-orange-500"
        >
          Find a technician
        </Button>
      </div>
    </main>
  );
};

export default AboutPage;
