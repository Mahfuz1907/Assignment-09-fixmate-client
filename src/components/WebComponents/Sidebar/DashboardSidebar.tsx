"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  CreditCard,
  FolderKanban,
  HelpCircle,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  Wrench,
  X,
  Zap,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { GettingSessionFromClient } from "@/library/GettingSessions/GetSessionClient";

export type DashboardRole = "customer" | "technician" | "admin";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  description?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const ROLE_NAV_CONFIG: Record<DashboardRole, { label: string; badgeClass: string; icon: LucideIcon; groups: NavGroup[] }> = {
  customer: {
    label: "Customer Portal",
    badgeClass: "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300",
    icon: CircleUserRound,
    groups: [
      {
        label: "Main",
        items: [
          {
            title: "Overview",
            href: "/dashboard/customer",
            icon: LayoutDashboard,
            description: "Activity, stats & shortcuts",
          },
        ],
      },
      {
        label: "Repairs & Finance",
        items: [
          {
            title: "My Bookings",
            href: "/dashboard/customer/bookings",
            icon: CalendarCheck,
            description: "Track jobs & pay invoices",
          },
          {
            title: "Payment History",
            href: "/dashboard/customer/payments",
            icon: CreditCard,
            description: "Paid receipts & Stripe history",
          },
        ],
      },
    ],
  },
  technician: {
    label: "Technician Portal",
    badgeClass: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    icon: Wrench,
    groups: [
      {
        label: "Main",
        items: [
          {
            title: "Overview",
            href: "/dashboard/technician",
            icon: LayoutDashboard,
            description: "Workshop metrics & earnings",
          },
        ],
      },
      {
        label: "Services Management",
        items: [
          {
            title: "Add a Service",
            href: "/dashboard/technician/add-service",
            icon: PlusCircle,
            description: "Create listing with ImgBB",
          },
          {
            title: "My Services",
            href: "/dashboard/technician/my-services",
            icon: FolderKanban,
            description: "Full CRUD & availability",
          },
        ],
      },
      {
        label: "Customer Requests",
        items: [
          {
            title: "Manage Requests",
            href: "/dashboard/technician/requests",
            icon: Zap,
            description: "Job pipeline & status updates",
          },
        ],
      },
    ],
  },
  admin: {
    label: "Admin Control",
    badgeClass: "border-violet-500/25 bg-violet-500/10 text-violet-700 dark:text-violet-300",
    icon: ShieldCheck,
    groups: [
      {
        label: "Control Panel",
        items: [
          {
            title: "Overview",
            href: "/dashboard/admin",
            icon: LayoutDashboard,
            description: "Platform growth & health",
          },
        ],
      },
      {
        label: "Moderation & Users",
        items: [
          {
            title: "Manage Users",
            href: "/dashboard/admin/users",
            icon: Users,
            description: "Role manager & user accounts",
          },
          {
            title: "Service Approval",
            href: "/dashboard/admin/services",
            icon: UserCheck,
            badge: "Review",
            description: "Approve or reject listings",
          },
        ],
      },
      {
        label: "Operations & Audit",
        items: [
          {
            title: "All Bookings",
            href: "/dashboard/admin/bookings",
            icon: CalendarCheck,
            description: "Complete repair job logs",
          },
          {
            title: "Transactions",
            href: "/dashboard/admin/transactions",
            icon: ReceiptText,
            description: "Stripe payout audit & revenue",
          },
        ],
      },
    ],
  },
};

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U"
  );
}

function BrandLogo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
      aria-label="FixMate Home"
    >
      <div className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-white shadow-[0_4px_14px_-3px_rgba(245,158,11,0.7)] transition-transform duration-300 group-hover:-rotate-6">
        <Wrench className="size-5" strokeWidth={2.4} />
        <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-background bg-emerald-500" />
      </div>

      {!collapsed && (
        <div className="flex flex-col leading-none">
          <span className="text-xl font-extrabold tracking-tight text-foreground">
            Fix<span className="text-amber-500">Mate</span>
          </span>
          <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Pro Dashboard
          </span>
        </div>
      )}
    </Link>
  );
}

interface SidebarContentProps {
  role: DashboardRole;
  collapsed: boolean;
  onNavigate?: () => void;
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  onSignOut?: () => void;
}

function SidebarNav({
  role,
  collapsed,
  onNavigate,
  user,
  onSignOut,
}: SidebarContentProps) {
  const pathname = usePathname();
  const config = ROLE_NAV_CONFIG[role];
  const RoleIcon = config.icon;

  const isActive = (href: string) => {
    if (href === `/dashboard/${role}`) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="flex h-full flex-col justify-between overflow-y-auto overflow-x-hidden p-3.5">
      {/* Top Header / Role Tag */}
      <div>
        <div
          className={cn(
            "flex items-center gap-3 border-b border-border/60 pb-4",
            collapsed ? "justify-center" : "justify-between"
          )}
        >
          <BrandLogo collapsed={collapsed} />
        </div>

        {/* Role Pill Banner */}
        {!collapsed ? (
          <div className="mt-3.5 flex items-center justify-between rounded-xl border border-border/60 bg-muted/40 p-2.5">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <RoleIcon className="size-4" />
              </span>
              <div className="leading-tight">
                <p className="text-xs font-bold text-foreground">
                  {config.label}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                  {role}
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={cn("text-[9px] px-1.5 py-0 uppercase", config.badgeClass)}
            >
              Active
            </Badge>
          </div>
        ) : (
          <div className="mt-3 flex justify-center" title={`${config.label} (${role})`}>
            <span className="flex size-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <RoleIcon className="size-4" />
            </span>
          </div>
        )}

        {/* Navigation Groups */}
        <nav className="mt-4 space-y-5" aria-label="Sidebar Navigation">
          {config.groups.map((group) => (
            <div key={group.label} className="space-y-1">
              {!collapsed && (
                <p className="px-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/70">
                  {group.label}
                </p>
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      title={collapsed ? item.title : undefined}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-xs font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
                        active
                          ? "bg-amber-500 text-white shadow-md shadow-amber-500/20 font-bold"
                          : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                        collapsed && "justify-center px-0 py-2.5"
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110",
                          active ? "text-white" : "text-muted-foreground group-hover:text-amber-500"
                        )}
                      />

                      {!collapsed && (
                        <div className="flex flex-1 items-center justify-between">
                          <span className="truncate">{item.title}</span>
                          {item.badge && (
                            <span
                              className={cn(
                                "rounded-full px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider",
                                active
                                  ? "bg-white text-amber-600"
                                  : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Active indicator dot on left */}
                      {active && !collapsed && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-white opacity-80" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer / Account & Exit to Home */}
      <div className="space-y-2 border-t border-border/60 pt-3">
        {/* Return to Public Home */}
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2.5 rounded-xl border border-border/60 px-2.5 py-2 text-xs font-medium text-muted-foreground transition-all hover:border-amber-500/40 hover:bg-muted/60 hover:text-foreground",
            collapsed && "justify-center px-0"
          )}
          title="Return to Public Site"
        >
          <Home className="size-4 shrink-0 text-amber-500" />
          {!collapsed && <span>Back to Home</span>}
        </Link>

        {/* User Card with Quick Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl p-1.5 transition-colors hover:bg-muted/60 text-left outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
                  collapsed && "justify-center p-1"
                )}
              />
            }
          >
            <Avatar className="size-8.5 shrink-0 ring-1.5 ring-amber-500/30">
              {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
              <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-[10px] font-bold text-white">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>

            {!collapsed && (
              <div className="min-w-0 flex-1 leading-tight">
                <p className="truncate text-xs font-bold text-foreground">
                  {user.name}
                </p>
                <p className="truncate text-[10px] text-muted-foreground">
                  {user.email}
                </p>
              </div>
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="right"
            align="end"
            sideOffset={8}
            className="w-56 rounded-2xl p-1.5 shadow-xl"
          >
            <div className="px-2 py-1.5 leading-tight">
              <p className="text-xs font-bold">{user.name}</p>
              <p className="truncate text-[10px] text-muted-foreground">{user.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/profile" />} className="cursor-pointer text-xs">
              <CircleUserRound className="mr-2 size-3.5" />
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/" />} className="cursor-pointer text-xs">
              <Home className="mr-2 size-3.5" />
              FixMate Home
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onSignOut}
              className="cursor-pointer text-xs text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="mr-2 size-3.5" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

interface DashboardSidebarProps {
  currentRole?: DashboardRole;
  children: React.ReactNode;
}

export function DashboardSidebarLayout({
  currentRole = "customer",
  children,
}: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const session = GettingSessionFromClient();
  const sessionUser = session?.user;

  // Derive role dynamically from session if available, else prop
  const detectedRole: DashboardRole =
    sessionUser && "role" in sessionUser && typeof sessionUser.role === "string"
      ? (["customer", "technician", "admin"].includes(sessionUser.role)
          ? (sessionUser.role as DashboardRole)
          : currentRole)
      : currentRole;

  const userData = {
    name: sessionUser?.name || "Alex Morgan",
    email: sessionUser?.email || "alex.morgan@fixmate.com",
    image: sessionUser?.image || null,
  };

  const handleSignOut = () => {
    // Redirect or trigger auth client signOut
    window.location.href = "/sign-in";
  };

  return (
    <div className="relative flex min-h-screen bg-background">
      {/* Desktop Sticky Collapsible Sidebar */}
      <aside
        className={cn(
          "sticky top-0 z-30 hidden h-screen shrink-0 border-r border-border/70 bg-card/90 backdrop-blur-xl transition-[width] duration-300 md:flex flex-col",
          collapsed ? "w-18" : "w-64"
        )}
      >
        <SidebarNav
          role={detectedRole}
          collapsed={collapsed}
          user={userData}
          onSignOut={handleSignOut}
        />

        {/* Collapse / Expand Toggle Button */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-8 flex size-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-transform hover:bg-muted hover:text-foreground"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="size-3.5" />
          ) : (
            <ChevronLeft className="size-3.5" />
          )}
        </button>
      </aside>

      {/* Main Column (TopBar + Content) */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Bar for Desktop & Mobile */}
        <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border/70 bg-background/80 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile Sheet Trigger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl border-border/70 md:hidden"
                    aria-label="Open sidebar menu"
                  />
                }
              >
                <Menu className="size-5" />
              </SheetTrigger>

              <SheetContent
                side="left"
                className="w-72 p-0 bg-card border-r border-border/70"
                showCloseButton={true}
              >
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation Menu</SheetTitle>
                  <SheetDescription>Dashboard sidebar links</SheetDescription>
                </SheetHeader>
                <SidebarNav
                  role={detectedRole}
                  collapsed={false}
                  user={userData}
                  onNavigate={() => setMobileOpen(false)}
                  onSignOut={handleSignOut}
                />
              </SheetContent>
            </Sheet>

            {/* Breadcrumb / Section Header Indicator */}
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "hidden sm:inline-flex uppercase text-[10px] tracking-wider font-semibold",
                  ROLE_NAV_CONFIG[detectedRole].badgeClass
                )}
              >
                {ROLE_NAV_CONFIG[detectedRole].label}
              </Badge>
              <span className="text-xs text-muted-foreground hidden lg:inline">
                • FixMate Service Operations
              </span>
            </div>
          </div>

          {/* Top Bar Right: Home link + Profile Pill */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-muted/40 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Home className="size-3.5 text-amber-500" />
              <span>FixMate Home</span>
            </Link>

            <Link
              href="/profile"
              className="flex items-center gap-2.5 rounded-full border border-border/70 bg-card p-1 pr-3 hover:border-amber-500/40 transition-colors shadow-xs"
            >
              <Avatar className="size-7.5 ring-1 ring-amber-500/30">
                {userData.image ? (
                  <AvatarImage src={userData.image} alt={userData.name} />
                ) : null}
                <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-[10px] font-bold text-white">
                  {getInitials(userData.name)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="text-xs font-bold text-foreground">
                  {userData.name}
                </span>
                <span className="mt-0.5 text-[10px] font-medium uppercase text-muted-foreground">
                  {detectedRole}
                </span>
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content Rendered Here */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">{children}</main>
      </div>
    </div>
  );
}

export default DashboardSidebarLayout;
