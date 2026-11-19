"use client";

import { useState } from "react";
import type { ChangeEvent, ComponentProps, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  CircleExclamationPoint,
  Eye,
  EyeOff,
  LockKeyhole,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type TextFieldProps = {
  id: string;
  label: string;
  icon: LucideIcon;
  error?: string;
  hint?: ReactNode;
  trailing?: ReactNode;
  inputClassName?: string;
} & Omit<ComponentProps<typeof Input>, "id" | "className">;

export function TextField({
  id,
  label,
  icon: Icon,
  error,
  hint,
  trailing,
  inputClassName,
  ...inputProps
}: TextFieldProps) {
  const describedBy =
    [error ? `${id}-error` : null, hint ? `${id}-hint` : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div>
      <Label htmlFor={id} className="mb-1.5 text-sm font-medium">
        {label}
      </Label>

      <div className="relative">
        <Icon
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70"
          aria-hidden="true"
        />
        <Input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "h-11 rounded-xl border-border/70 bg-background/70 pl-10 text-sm shadow-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-amber-500/60 focus-visible:ring-3 focus-visible:ring-amber-500/20 dark:bg-white/[0.03]",
            trailing && "pr-11",
            error &&
              "border-destructive/60 focus-visible:border-destructive focus-visible:ring-destructive/20",
            inputClassName,
          )}
          {...inputProps}
        />
        {trailing}
      </div>

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-destructive"
        >
          <CircleExclamationPoint
            className="mt-px size-3.5 shrink-0"
            aria-hidden="true"
          />
          <span>{error}</span>
        </p>
      ) : null}

      {hint ? (
        <div id={`${id}-hint`} className="mt-1.5 text-xs text-muted-foreground">
          {hint}
        </div>
      ) : null}
    </div>
  );
}

type PasswordFieldProps = {
  id: string;
  name?: string;
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  hint?: ReactNode;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
};

export function PasswordField({
  id,
  label,
  error,
  hint,
  ...inputProps
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      id={id}
      label={label}
      icon={LockKeyhole}
      error={error}
      hint={hint}
      type={visible ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-amber-500/30 focus-visible:outline-none"
        >
          {visible ? (
            <EyeOff className="size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-4" aria-hidden="true" />
          )}
        </button>
      }
      {...inputProps}
    />
  );
}
