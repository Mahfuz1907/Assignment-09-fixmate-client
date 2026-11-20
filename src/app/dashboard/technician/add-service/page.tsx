import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AddServiceForm from "./AddServiceForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Service · FixMate",
};

export default async function AddServicePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Top Breadcrumb & Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/technician/my-services"
              className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              My Services
            </Link>
            <span className="text-muted-foreground/40">•</span>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              New Listing
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Add a Repair Service
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            List your expertise with clear pricing, duration, and service
            coverage.
          </p>
        </div>

        <Badge
          variant="outline"
          className="self-start sm:self-center border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs px-3 py-1 font-semibold"
        >
          <Sparkles className="mr-1.5 size-3.5" />
          Pending Approval Workflow
        </Badge>
      </div>

      {/* Main Form Container */}
      <AddServiceForm />
    </div>
  );
}
