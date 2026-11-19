import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  CreditCard,
  Search,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    step: "01",
    title: "Find a Service",
    description: "Browse categorized services, compare upfront prices, and read verified reviews from genuine customers.",
    icon: Search,
    accentColor: "from-amber-500 to-orange-500",
    badge: "Step 1",
  },
  {
    step: "02",
    title: "Send a Request",
    description: "Select your preferred date, time, and service mode (doorstep Home Visit or nearby Shop Drop-off).",
    icon: CalendarCheck,
    accentColor: "from-amber-600 to-amber-700",
    badge: "Step 2",
  },
  {
    step: "03",
    title: "Technician Fixes It",
    description: "A background-checked, certified technician arrives equipped with genuine tools and authentic spare parts.",
    icon: Wrench,
    accentColor: "from-orange-500 to-amber-600",
    badge: "Step 3",
  },
  {
    step: "04",
    title: "Pay After Completion",
    description: "Test and inspect your repaired appliance first. Only pay once you are completely satisfied with the fix.",
    icon: CreditCard,
    accentColor: "from-emerald-500 to-teal-600",
    badge: "Step 4",
  },
];

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <Badge
            variant="outline"
            className="mb-3 inline-flex items-center gap-1 rounded-full border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400"
          >
            <Sparkles className="size-3.5" />
            Simple & Transparent Process
          </Badge>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            How FixMate Works
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Get your broken device or home appliance repaired in 4 hassle-free steps with complete peace of mind.
          </p>
        </div>

        {/* 4-Step Visual Flow */}
        <div className="relative mt-14">
          {/* Connecting Line for desktop */}
          <div
            className="absolute top-1/2 left-8 right-8 -translate-y-8 hidden h-0.5 bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 lg:block opacity-30"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((stepItem, index) => {
              const Icon = stepItem.icon;
              return (
                <div
                  key={stepItem.step}
                  className="group relative flex flex-col items-center rounded-2xl border border-border/70 bg-card p-6 text-center shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-lg"
                >
                  {/* Step Number Tag */}
                  <span className="absolute -top-3 left-6 rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-bold text-muted-foreground border border-border">
                    {stepItem.step}
                  </span>

                  {/* Icon Circle */}
                  <div
                    className={`relative mb-5 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${stepItem.accentColor} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="size-6" />
                  </div>

                  <h3 className="text-lg font-bold text-foreground">
                    {stepItem.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {stepItem.description}
                  </p>

                  <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                    <CheckCircle2 className="size-3.5 text-emerald-500" />
                    <span>Guaranteed Care</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Prompt */}
        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            Have a faulty device waiting to be fixed?
          </p>
          <Link href="/services">
            <Button className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-semibold text-white hover:from-amber-600 hover:to-orange-600">
              Book a Repair Now
              <ArrowRight className="ml-1.5 size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
