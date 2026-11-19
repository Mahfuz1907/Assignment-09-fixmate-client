"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CircleExclamationPoint,
  LoaderCircle,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PasswordField, TextField } from "./AuthFields";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type SignUpRole = "customer" | "technician";

type SignUpValues = {
  fullName: string;
  email: string;
  password: string;
};

type SignUpErrors = Partial<Record<keyof SignUpValues | "role", string>>;

const ROLE_OPTIONS = [
  {
    value: "customer",
    label: "Customer",
    description: "Book trusted pros for repairs around the home.",
    icon: UserRound,
  },
  {
    value: "technician",
    label: "Technician",
    description: "Find local jobs and grow your repair business.",
    icon: Wrench,
  },
] as const;

export function SignUpForm() {
  const [values, setValues] = useState<SignUpValues>({
    fullName: "",
    email: "",
    password: "",
  });
  const [role, setRole] = useState<SignUpRole>("customer");
  const [errors, setErrors] = useState<SignUpErrors>({});
  const router = useRouter();

  // Purely visual hints for the design — the real check happens on submit.
  const passwordRules = [
    { label: "6+ characters", met: values.password.length >= 6 },
    { label: "An uppercase letter", met: /[A-Z]/.test(values.password) },
    { label: "A lowercase letter", met: /[a-z]/.test(values.password) },
  ];

  function handleChange(field: keyof SignUpValues) {
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
   * TODO: 1. Validate the full name is present, the email format is valid and
   *          the password has 6+ characters, one uppercase and one lowercase
   *          letter. Show the errors under each field and stop here if invalid.
   * TODO: 2. Send `{ name: fullName, email, password, role }` to your auth
   *          client. The server must also reject any role other than
   *          `"customer"` or `"technician"` and fall back to `"customer"`.
   * TODO: 3. On success: `toast.success("Account created!")` and redirect to
   *          the role dashboard (`/dashboard/customer` or
   *          `/dashboard/technician`).
   * TODO: 4. On failure (e.g. email already exists): `toast.error(...)` and set
   *          the relevant field errors below.
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    const newErrors: SignUpErrors = {};

    // Validate full name
    if (!values.fullName.trim()) {
      newErrors.fullName = "Please enter your full name.";
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!emailRegex.test(values.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Validate password (6+ chars, uppercase, lowercase)
    if (!values.password) {
      newErrors.password = "Please enter a password.";
    } else if (values.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    } else if (!/[A-Z]/.test(values.password)) {
      newErrors.password =
        "Password must include at least one uppercase letter.";
    } else if (!/[a-z]/.test(values.password)) {
      newErrors.password =
        "Password must include at least one lowercase letter.";
    }

    // Validate role
    if (!role) {
      newErrors.role = "Please select an account type.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const formEntries = Object.fromEntries(formData) as Record<string, string>;

    // Normalized user data ready for auth provider (BetterAuth, etc.)
    const userData = {
      ...formEntries,
      fullName: values.fullName.trim(),
      email: values.email.trim().toLowerCase(),
      password: values.password,
      role: role,
    };

    console.log("Sign up userData:", userData);

    const { data, error } = await signUp.email({
      name: userData.fullName,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      phone: "",
      area: "",
      bio: "",
    });

    if (data) {
      toast.success("User Created Successfully", { position: "top-center" });
      router.push("/");
    } else if (error) {
      toast.error("User Sign Up Failed", { position: "top-center" });
      console.log(error);
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
          <Sparkles className="size-3" aria-hidden="true" />
          Get started
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
          Create your account
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Join thousands of homeowners and pros fixing things the right way.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="relative mt-7 flex flex-col gap-4"
      >
        <TextField
          id="sign-up-name"
          name="fullName"
          label="Full name"
          icon={UserRound}
          type="text"
          autoComplete="name"
          placeholder="Alex Morgan"
          value={values.fullName}
          onChange={handleChange("fullName")}
          error={errors.fullName}
          required
        />

        <TextField
          id="sign-up-email"
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
          id="sign-up-password"
          name="password"
          label="Password"
          autoComplete="new-password"
          placeholder="Create a password"
          value={values.password}
          onChange={handleChange("password")}
          error={errors.password}
          hint={
            <ul className="grid gap-x-4 gap-y-1.5 sm:grid-cols-2">
              {passwordRules.map((rule) => (
                <li
                  key={rule.label}
                  className={cn(
                    "flex items-center gap-1.5 text-xs transition-colors",
                    rule.met
                      ? "font-medium text-emerald-700 dark:text-emerald-400"
                      : "text-muted-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-3.5 shrink-0 items-center justify-center rounded-full border transition-colors",
                      rule.met
                        ? "border-emerald-500/50 bg-emerald-500/15"
                        : "border-border/80",
                    )}
                  >
                    <Check
                      className={cn(
                        "size-2.5 transition-opacity",
                        rule.met ? "opacity-100" : "opacity-0",
                      )}
                      aria-hidden="true"
                    />
                  </span>
                  {rule.label}
                </li>
              ))}
            </ul>
          }
        />

        <fieldset>
          <legend className="mb-2 text-sm font-medium">
            I want to join as
          </legend>

          <div className="grid gap-3 sm:grid-cols-2">
            {ROLE_OPTIONS.map((option) => {
              const RoleIcon = option.icon;

              return (
                <label
                  key={option.value}
                  className="group relative cursor-pointer"
                >
                  <input
                    type="radio"
                    name="role"
                    value={option.value}
                    checked={role === option.value}
                    onChange={() => {
                      setRole(option.value);
                      setErrors((previous) =>
                        previous.role
                          ? { ...previous, role: undefined }
                          : previous,
                      );
                    }}
                    className="peer sr-only"
                  />
                  <span className="flex h-full flex-col gap-2.5 rounded-2xl border border-border/70 bg-background/60 p-4 transition-all duration-200 peer-checked:border-amber-500/70 peer-checked:bg-amber-50/80 peer-checked:shadow-[0_12px_30px_-22px_rgba(245,158,11,0.9)] peer-focus-visible:ring-3 peer-focus-visible:ring-amber-500/30 peer-focus-visible:outline-none hover:border-amber-500/40 dark:peer-checked:bg-amber-500/10">
                    <span className="flex items-center justify-between">
                      <span className="flex size-9 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors duration-200 group-has-checked:bg-amber-500 group-has-checked:text-white">
                        <RoleIcon className="size-4" aria-hidden="true" />
                      </span>
                      <span className="flex size-4 items-center justify-center rounded-full border border-border/80 transition-colors duration-200 group-has-checked:border-amber-500 group-has-checked:bg-amber-500">
                        <span className="size-1.5 rounded-full bg-white opacity-0 transition-opacity duration-200 group-has-checked:opacity-100" />
                      </span>
                    </span>
                    <span className="text-sm font-semibold">
                      {option.label}
                    </span>
                    <span className="text-xs leading-5 text-muted-foreground">
                      {option.description}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>

          {errors.role ? (
            <p
              role="alert"
              className="mt-2 flex items-start gap-1.5 text-xs font-medium text-destructive"
            >
              <CircleExclamationPoint
                className="mt-px size-3.5 shrink-0"
                aria-hidden="true"
              />
              {errors.role}
            </p>
          ) : null}

          <p className="mt-2.5 flex items-start gap-1.5 text-xs leading-5 text-muted-foreground">
            <ShieldCheck
              className="mt-0.5 size-3.5 shrink-0 text-amber-600 dark:text-amber-400"
              aria-hidden="true"
            />
            Admin accounts are created by invitation only.
          </p>
        </fieldset>

        <Button
          type="submit"
          className="group mt-1 h-11 w-full rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-orange-500 text-sm font-semibold text-zinc-950 shadow-[0_14px_30px_-14px_rgba(245,158,11,0.9)] hover:from-amber-300 hover:via-amber-400 hover:to-orange-500 disabled:opacity-70"
        >
          Create account
          <ArrowRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Button>
      </form>

      <div className="relative mt-6 border-t border-border/60 pt-5">
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-foreground underline-offset-4 transition-colors hover:text-amber-700 hover:underline dark:hover:text-amber-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
