"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, ArrowUp, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;

    setSubscribed(true);
    setEmail("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Subscribe to the FixMate newsletter"
      className="w-full lg:max-w-md"
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="footer-email" className="sr-only">
            Email address
          </label>
          <Input
            id="footer-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            aria-describedby="footer-email-hint"
            onChange={(event) => {
              setEmail(event.target.value);
              if (subscribed) setSubscribed(false);
            }}
            className="h-11 rounded-xl border-white/15 bg-white/[0.06] px-3.5 text-sm text-white shadow-none placeholder:text-zinc-500 focus-visible:border-amber-500/60 focus-visible:ring-amber-500/20 dark:bg-white/[0.06] dark:focus-visible:border-amber-500/60"
          />
        </div>
        <Button
          type="submit"
          className="group h-11 shrink-0 rounded-xl bg-amber-500 px-5 font-semibold text-zinc-950 shadow-[0_8px_20px_-10px_rgba(245,158,11,0.9)] hover:bg-amber-400"
        >
          {subscribed ? (
            <>
              Subscribed
              <Check className="size-4" aria-hidden="true" />
            </>
          ) : (
            <>
              Subscribe
              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </>
          )}
        </Button>
      </div>
      <p
        id="footer-email-hint"
        aria-live="polite"
        className={cn(
          "mt-2.5 text-xs",
          subscribed ? "text-emerald-300" : "text-zinc-500"
        )}
      >
        {subscribed
          ? "You're on the list — watch your inbox."
          : "One useful email a month. Unsubscribe anytime."}
      </p>
    </form>
  );
}

export function BackToTop() {
  const scrollToTop = () => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={scrollToTop}
      className="w-fit rounded-full border-white/15 bg-transparent text-xs font-medium text-zinc-300 hover:border-amber-500/40 hover:bg-white/5 hover:text-white focus-visible:border-amber-500/60 focus-visible:ring-amber-500/30"
    >
      Back to top
      <ArrowUp className="size-3.5" aria-hidden="true" />
    </Button>
  );
}
