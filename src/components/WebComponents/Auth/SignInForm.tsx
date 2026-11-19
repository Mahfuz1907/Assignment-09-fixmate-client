"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  LoaderCircle,
  LogIn,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PasswordField, TextField } from "./AuthFields";

type SignInValues = {
  email: string;
  password: string;
};

type SignInErrors = Partial<Record<keyof SignInValues, string>>;

export function SignInForm() {
  const [values, setValues] = useState<SignInValues>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<SignInErrors>({});
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field: keyof SignInValues) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      setValues((previous) => ({ ...previous, [field]: value }));
      setErrors((previous) =>
        previous[field] ? { ...previous, [field]: undefined } : previous,
      );
    };
  }

  /**
   * Stub — wire this up with your auth provider (e.g. BetterAuth).
   *
   * TODO: 1. Validate that both fields are filled and the email is well formed.
   * TODO: 2. Call your auth client, e.g.
   *          `await authClient.signIn.email({ email, password, rememberMe })`.
   * TODO: 3. On success: `toast.success("Welcome back!")` and redirect to the
   *          `?redirect=...` target if present — otherwise to the user's role
   *          dashboard (`/dashboard/customer`, `/dashboard/technician` or
   *          `/dashboard/admin`).
   * TODO: 4. On failure: `toast.error("Incorrect email or password.")` and set
   *          the relevant field errors below.
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    const newErrors: SignInErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!emailRegex.test(values.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!values.password) {
      newErrors.password = "Please enter your password.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const formEntries = Object.fromEntries(formData);

    // Normalized user credentials ready for auth provider (BetterAuth, etc.)
    const userData = {
      ...formEntries,
      email: values.email.trim().toLowerCase(),
      password: values.password,
      rememberMe: rememberMe,
    };

    console.log("Sign in userData:", userData);

    try {
      // Authentication logic / BetterAuth call goes here:
      // await authClient.signIn.email({ email: userData.email, password: userData.password, rememberMe: userData.rememberMe });
    } catch (err) {
      console.error("Sign in error:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/85 p-6 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 size-44 rounded-full bg-amber-400/10 blur-3xl"
      />

      <div className="relative">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
          <LogIn className="size-3" aria-hidden="true" />
          Welcome back
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
          Sign in to FixMate
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Your bookings, quotes and trusted pros — all in one place.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="relative mt-7 flex flex-col gap-4"
      >
        <TextField
          id="sign-in-email"
          name="email"
          label="Email"
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={handleChange("email")}
          error={errors.email}
          required
        />

        <PasswordField
          id="sign-in-password"
          name="password"
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={values.password}
          onChange={handleChange("password")}
          error={errors.password}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="sign-in-remember"
              name="rememberMe"
              checked={rememberMe}
              onCheckedChange={setRememberMe}
              className="border-border/80 data-checked:border-amber-500 data-checked:bg-amber-500 data-checked:text-zinc-950"
            />
            <Label
              htmlFor="sign-in-remember"
              className="text-xs font-medium text-muted-foreground"
            >
              Remember me
            </Label>
          </div>
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-amber-700 underline-offset-4 transition-colors hover:text-amber-600 hover:underline dark:text-amber-400 dark:hover:text-amber-300"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="group mt-1 h-11 w-full rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-orange-500 text-sm font-semibold text-zinc-950 shadow-[0_14px_30px_-14px_rgba(245,158,11,0.9)] hover:from-amber-300 hover:via-amber-400 hover:to-orange-500 disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle
                className="size-4 animate-spin"
                aria-hidden="true"
              />
              Signing in…
            </>
          ) : (
            <>
              Sign in
              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </>
          )}
        </Button>
      </form>

      <div className="relative mt-6 border-t border-border/60 pt-5">
        <p className="text-center text-sm text-muted-foreground">
          New to FixMate?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-foreground underline-offset-4 transition-colors hover:text-amber-700 hover:underline dark:hover:text-amber-300"
          >
            Create an account
          </Link>
        </p>
      </div>

      <p className="relative mt-4 flex items-start justify-center gap-1.5 text-center text-[11px] leading-5 text-muted-foreground">
        <ShieldCheck
          className="mt-0.5 size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
          aria-hidden="true"
        />
        Secure sign-in. We never share your details.
      </p>
    </div>
  );
}
