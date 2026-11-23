import React from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";

// if user of a role tries to access any page of different role, then the user is redirected to this page

const UnAuthorizedPage = () => {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 items-center justify-center px-4 py-16 sm:px-6 sm:py-24">
      <div className="relative w-full overflow-hidden rounded-3xl border border-dashed border-border/70 bg-card/90 px-6 py-12 text-center shadow-[0_30px_80px_-50px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:px-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-56 rounded-full bg-amber-400/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-24 size-56 rounded-full bg-orange-500/10 blur-3xl"
        />

        <div className="relative">
          <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-amber-400/20 to-orange-500/10 text-amber-600 ring-1 ring-amber-500/25 dark:text-amber-400">
            <LockKeyhole className="size-8" aria-hidden="true" />
          </span>

          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-600 dark:text-amber-400">
            Access restricted
          </p>
          <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            You don&apos;t have access to this page
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Your current account role isn&apos;t allowed to view this area.
            Switch to the right account or contact an administrator if you
            think this is a mistake.
          </p>

          <div className="mx-auto mt-6 flex max-w-sm items-center justify-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs leading-5 text-muted-foreground">
            <ShieldCheck
              className="size-4 shrink-0 text-amber-600 dark:text-amber-400"
              aria-hidden="true"
            />
            <span>
              Each FixMate dashboard is available only to its assigned role.
            </span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UnAuthorizedPage;
