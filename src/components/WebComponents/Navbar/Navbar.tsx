"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  CircleUserRound,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  Sparkles,
  UserRoundPen,
  Wrench,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type NavbarRole = "customer" | "technician" | "admin";

export type NavbarUser = {
  name: string;
  email: string;
  image?: string | null;
  role: NavbarRole;
};

type NavbarProps = {
  /** The signed-in user. Pass `null` (or omit it) for the logged-out state. */
  user?: NavbarUser | null;
  /** Wire this to your auth provider. Falls back to redirecting to /sign-in. */
  onSignOut?: () => void | Promise<void>;
};

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "How It Works", href: "/about" },
] as const;

const ROLE_META: Record<
  NavbarRole,
  { label: string; href: string; icon: LucideIcon; badgeClass: string }
> = {
  customer: {
    label: "Customer",
    href: "/dashboard/customer",
    icon: CircleUserRound,
    badgeClass:
      "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  },
  technician: {
    label: "Technician",
    href: "/dashboard/technician",
    icon: Wrench,
    badgeClass:
      "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  admin: {
    label: "Admin",
    href: "/dashboard/admin",
    icon: ShieldCheck,
    badgeClass:
      "border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  },
};

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getInitials(name: string) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return initials.toUpperCase() || "U";
}

function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-amber-400 via-amber-500 to-orange-500 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_6px_16px_-8px_rgba(245,158,11,0.9)] transition-transform duration-300 group-hover:-rotate-6",
        className,
      )}
    >
      <Wrench className="size-5" strokeWidth={2.4} aria-hidden="true" />
      <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-background bg-emerald-500" />
    </span>
  );
}

function Brand() {
  return (
    <Link
      href="/"
      className="group flex shrink-0 items-center gap-2.5 rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      aria-label="FixMate home"
    >
      <BrandMark />
      <span className="flex flex-col leading-none">
        <span className="text-[1.3rem] font-extrabold tracking-tight">
          Fix<span className="text-amber-600 dark:text-amber-400">Mate</span>
        </span>
        <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Home repair pros
        </span>
      </span>
    </Link>
  );
}

function UserBadge({ role }: { role: NavbarRole }) {
  const meta = ROLE_META[role];
  const RoleIcon = meta.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "h-6 gap-1 rounded-full px-2 text-[10px] font-semibold uppercase tracking-wider",
        meta.badgeClass,
      )}
    >
      <RoleIcon className="size-3" aria-hidden="true" />
      {meta.label}
    </Badge>
  );
}

function AccountMenu({
  user,
  onSignOut,
}: {
  user: NavbarUser;
  onSignOut?: () => void | Promise<void>;
}) {
  const meta = ROLE_META[user.role];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="h-10 rounded-full py-1 pl-1 pr-2.5 data-popup-open:bg-muted"
            aria-label={`Open account menu for ${user.name}`}
          />
        }
      >
        <Avatar size="sm" className="ring-2 ring-amber-500/25">
          {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
          <AvatarFallback className="bg-linear-to-br from-amber-500 to-orange-500 text-[11px] font-bold text-white">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <span className="hidden flex-col items-start text-left xl:flex">
          <span className="max-w-28 truncate text-sm font-semibold leading-tight">
            {user.name}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {meta.label}
          </span>
        </span>
        <ChevronDown
          className="size-3.5 text-muted-foreground"
          aria-hidden="true"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-72! rounded-2xl p-1.5 shadow-xl ring-border/60"
      >
        <div className="flex items-center gap-3 rounded-xl bg-muted/60 p-2.5">
          <Avatar size="lg" className="ring-2 ring-amber-500/20">
            {user.image ? (
              <AvatarImage src={user.image} alt={user.name} />
            ) : null}
            <AvatarFallback className="bg-linear-to-br from-amber-500 to-orange-500 text-xs font-bold text-white">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between px-2 pb-2 pt-2.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Your account
          </span>
          <UserBadge role={user.role} />
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          render={<Link href={meta.href} />}
          className="gap-2 rounded-lg px-2 py-2"
        >
          <LayoutDashboard
            className="size-4 text-muted-foreground"
            aria-hidden="true"
          />
          Dashboard
          <ArrowUpRight
            className="ml-auto size-3.5 text-muted-foreground/70"
            aria-hidden="true"
          />
        </DropdownMenuItem>

        <DropdownMenuItem
          render={<Link href="/profile" />}
          className="gap-2 rounded-lg px-2 py-2"
        >
          <UserRoundPen
            className="size-4 text-muted-foreground"
            aria-hidden="true"
          />
          Update Profile
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          className="gap-2 rounded-lg px-2 py-2"
          onClick={() => void onSignOut?.()}
        >
          <LogOut className="size-4" aria-hidden="true" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileSignOut({
  onSignOut,
}: {
  onSignOut?: () => void | Promise<void>;
}) {
  return (
    <Button
      variant="ghost"
      className="h-11 w-full justify-start gap-2.5 rounded-xl px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
      onClick={() => void onSignOut?.()}
    >
      <LogOut className="size-4" aria-hidden="true" />
      Sign Out
    </Button>
  );
}

const Navbar = ({ user = null, onSignOut }: NavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleSignOut = () => {
    setOpen(false);

    if (onSignOut) {
      void onSignOut();
      return;
    }

    // Auth is not wired up yet — send the user to the sign-in page.
    router.push("/sign-in");
  };

  const roleMeta = user ? ROLE_META[user.role] : null;

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3 sm:px-5 lg:px-8">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 rounded-2xl border border-border/70 bg-background/80 px-3 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-18px_rgba(0,0,0,0.28)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 sm:px-4"
      >
        <Brand />

        {/* Desktop navigation */}
        <div className="mx-auto hidden items-center gap-1 rounded-full border border-border/60 bg-muted/40 p-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = isActiveRoute(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group/nav relative flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  active
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
                    : "text-muted-foreground hover:bg-background/70 hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full bg-amber-500 transition-all duration-200",
                    active
                      ? "scale-100 opacity-100"
                      : "scale-0 opacity-0 group-hover/nav:scale-100 group-hover/nav:opacity-60",
                  )}
                  aria-hidden="true"
                />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop actions */}
        <div className="ml-auto hidden items-center gap-1.5 lg:flex">
          {user ? (
            <AccountMenu user={user} onSignOut={handleSignOut} />
          ) : (
            <>
              <Link
                href="/sign-in"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "rounded-full px-3.5 font-semibold text-muted-foreground hover:text-foreground",
                )}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className={cn(
                  buttonVariants(),
                  "group h-9 rounded-full bg-foreground px-4 font-semibold text-background shadow-sm hover:bg-foreground/90",
                )}
              >
                Sign Up
                <ArrowUpRight
                  className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                className="ml-auto rounded-xl border-border/70 bg-background/60 lg:hidden"
                aria-label="Open navigation menu"
              />
            }
          >
            <Menu className="size-5" aria-hidden="true" />
          </SheetTrigger>

          <SheetContent
            side="right"
            showCloseButton={false}
            className="w-[86vw]! max-w-sm! gap-0 bg-background p-0"
          >
            <SheetHeader className="flex-row items-center justify-between border-b border-border/60 px-5 py-4">
              <SheetTitle className="flex items-center gap-2 text-base font-bold tracking-tight">
                <BrandMark className="size-8 rounded-lg" />
                <span>
                  Fix<span className="text-amber-600 dark:text-amber-400">Mate</span>
                </span>
              </SheetTitle>
              <SheetDescription className="sr-only">
                Main navigation and account actions
              </SheetDescription>
              <SheetClose
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Close navigation menu"
                  />
                }
              >
                <X className="size-4" aria-hidden="true" />
              </SheetClose>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Navigate
              </p>

              <nav aria-label="Mobile" className="mt-2 flex flex-col">
                {NAV_LINKS.map((link, index) => {
                  const active = isActiveRoute(pathname, link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                        active
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "font-mono text-[10px] font-semibold",
                          active
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-muted-foreground/60",
                        )}
                      >
                        0{index + 1}
                      </span>
                      <span className="text-lg font-semibold tracking-tight">
                        {link.label}
                      </span>
                      <ArrowRight
                        className={cn(
                          "ml-auto size-4 transition-all duration-200",
                          active
                            ? "text-amber-600 dark:text-amber-400"
                            : "-translate-x-1 text-muted-foreground/40 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                        )}
                        aria-hidden="true"
                      />
                    </Link>
                  );
                })}
              </nav>

              <div className="my-5 h-px bg-border/70" />

              {user && roleMeta ? (
                <>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Your account
                  </p>

                  <div className="mt-3 rounded-2xl border border-border/70 bg-muted/40 p-3">
                    <div className="flex items-center gap-3">
                      <Avatar size="lg" className="ring-2 ring-amber-500/20">
                        {user.image ? (
                          <AvatarImage src={user.image} alt={user.name} />
                        ) : null}
                        <AvatarFallback className="bg-linear-to-br from-amber-500 to-orange-500 text-xs font-bold text-white">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <UserBadge role={user.role} />
                    </div>
                  </div>

                  <div className="mt-3 flex flex-col gap-1">
                    <Link
                      href={roleMeta.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "h-11 w-full justify-start gap-2.5 rounded-xl px-3",
                      )}
                    >
                      <LayoutDashboard
                        className="size-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      Dashboard
                      <ArrowUpRight
                        className="ml-auto size-3.5 text-muted-foreground/70"
                        aria-hidden="true"
                      />
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "h-11 w-full justify-start gap-2.5 rounded-xl px-3",
                      )}
                    >
                      <UserRoundPen
                        className="size-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      Update Profile
                    </Link>
                    <MobileSignOut onSignOut={handleSignOut} />
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/sign-in"
                    onClick={() => setOpen(false)}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "h-11 w-full rounded-xl font-semibold",
                    )}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setOpen(false)}
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "group h-11 w-full rounded-xl bg-foreground font-semibold text-background shadow-sm hover:bg-foreground/90",
                    )}
                  >
                    Sign Up
                    <ArrowUpRight
                      className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              )}
            </div>

            <div className="border-t border-border/60 px-5 py-4">
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles
                  className="size-3.5 text-amber-500"
                  aria-hidden="true"
                />
                Trusted local pros. Fixed right, first time.
              </p>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
};

export default Navbar;
