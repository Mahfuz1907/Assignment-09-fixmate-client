"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 items-center justify-center px-4 py-16 sm:px-6 sm:py-24">
      <div className="w-full rounded-2xl border border-dashed border-border/70 bg-card px-6 py-14 text-center shadow-sm sm:px-10">
        <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-amber-400/20 to-orange-500/10 text-amber-600 ring-1 ring-amber-500/20 dark:text-amber-400">
          <AlertTriangle className="size-8" aria-hidden="true" />
        </span>

        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-600 dark:text-amber-400">
          Something went wrong
        </p>
        <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Unable to load the page
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Something unexpected happened while loading this page. You can try
          again, or head back to the homepage and browse the marketplace.
        </p>

        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <Button
            onClick={reset}
            className="h-10 gap-2 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-orange-500 px-4 font-semibold text-zinc-950 shadow-[0_10px_24px_-14px_rgba(245,158,11,0.9)] hover:from-amber-300 hover:to-orange-500"
          >
            <Wrench className="size-4" aria-hidden="true" />
            Try again
          </Button>
          <Button
            render={<Link href="/" />}
            nativeButton={false}
            variant="outline"
            className="h-10 gap-2 rounded-xl border-border/70 px-4 font-semibold"
          >
            <Wrench className="size-4" aria-hidden="true" />
            Back to home
          </Button>
        </div>
      </div>
    </main>
  );
}
