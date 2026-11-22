"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Search,
  ShieldCheck,
  UserCheck,
  Wrench,
  Users,
  Mail,
  Calendar,
  Check,
  Clock,
  ShieldAlert,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { IUsers } from "@/library/type";
import { UpdateRole } from "@/library/Action/Users";
import { getTokenFromClient } from "@/library/Action/GettingTokens/GettingTokenFromClient";

type RoleType = "customer" | "technician" | "admin";

interface ManageUsersTableProps {
  initialUsers: IUsers[];
  currentAdminEmail?: string;
}

const ROLE_CONFIG: Record<
  RoleType,
  { label: string; badgeClass: string; icon: typeof UserCheck }
> = {
  customer: {
    label: "Customer",
    badgeClass:
      "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300",
    icon: UserCheck,
  },
  technician: {
    label: "Technician",
    badgeClass:
      "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    icon: Wrench,
  },
  admin: {
    label: "Admin",
    badgeClass:
      "border-violet-500/25 bg-violet-500/10 text-violet-700 dark:text-violet-300",
    icon: ShieldCheck,
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

function formatDate(dateString?: string) {
  if (!dateString) return "N/A";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "N/A";
    return format(d, "MMM dd, yyyy");
  } catch {
    return "N/A";
  }
}

export function ManageUsersTable({
  initialUsers,
  currentAdminEmail,
}: ManageUsersTableProps) {
  const [users, setUsers] = useState<IUsers[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Compute stat metrics
  const stats = useMemo(() => {
    const total = users.length;
    const customers = users.filter(
      (u) => (u.role?.toLowerCase() || "customer") === "customer",
    ).length;
    const technicians = users.filter(
      (u) => u.role?.toLowerCase() === "technician",
    ).length;
    const admins = users.filter(
      (u) => u.role?.toLowerCase() === "admin",
    ).length;
    return { total, customers, technicians, admins };
  }, [users]);

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const normalizedRole = u.role?.toLowerCase() || "customer";
      const matchesRole =
        roleFilter === "all" ? true : normalizedRole === roleFilter;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.area?.toLowerCase().includes(q);

      return matchesRole && matchesSearch;
    });
  }, [users, roleFilter, searchQuery]);

  // Role update handler
  const handleRoleChange = async (user: IUsers, newRole: RoleType) => {
    const currentRole = (user.role?.toLowerCase() || "customer") as RoleType;
    if (currentRole === newRole) return;

    // Disallow admin changing their own role
    if (
      currentAdminEmail &&
      user.email?.toLowerCase() === currentAdminEmail.toLowerCase()
    ) {
      toast.error("Action Prohibited", {
        description: "Admins cannot change their own role.",
      });
      return;
    }

    // Attempt to hit Express / BetterAuth backend endpoint if available
    const token = await getTokenFromClient();
    const result = await UpdateRole(
      user._id,
      { role: newRole },
      token as string,
    );
    if (result.ok || result.success || result.acknowledged) {
      toast.success("Role Updated Successfully", {
        description: `${user.name}'s role changed to ${ROLE_CONFIG[newRole].label}.`,
        position: "top-center",
      });
    }

    // Optimistic state update
    setUsers((prev) =>
      prev.map((u) => (u._id === user._id ? { ...u, role: newRole } : u)),
    );

    console.log(`Updated user ${user.name} (${user._id}) role to: ${newRole}`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Quick Stats Overview Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <Card className="rounded-2xl border border-border/70 bg-card/90 shadow-xs">
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex size-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Users className="size-5" />
            </span>
            <div>
              <p className="text-xl font-extrabold text-foreground">
                {stats.total}
              </p>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Total Users
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/70 bg-card/90 shadow-xs">
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex size-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400">
              <UserCheck className="size-5" />
            </span>
            <div>
              <p className="text-xl font-extrabold text-foreground">
                {stats.customers}
              </p>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Customers
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/70 bg-card/90 shadow-xs">
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex size-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Wrench className="size-5" />
            </span>
            <div>
              <p className="text-xl font-extrabold text-foreground">
                {stats.technicians}
              </p>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Technicians
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/70 bg-card/90 shadow-xs">
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex size-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-400">
              <ShieldCheck className="size-5" />
            </span>
            <div>
              <p className="text-xl font-extrabold text-foreground">
                {stats.admins}
              </p>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Admins
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Search & Filters Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or area..."
            className="h-10 rounded-xl pl-9 text-xs sm:text-sm border-border/70 focus-visible:border-amber-500/60 focus-visible:ring-amber-500/20"
          />
        </div>

        {/* Role Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto rounded-xl border border-border/60 bg-muted/40 p-1">
          {["all", "customer", "technician", "admin"].map((tab) => {
            const active = roleFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setRoleFilter(tab)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all",
                  active
                    ? "bg-background text-foreground shadow-xs ring-1 ring-border/60"
                    : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
                )}
              >
                {tab === "all" ? "All Users" : tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Responsive Table & Mobile Cards */}
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs">
        {/* Desktop & Tablet Table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead className="w-72 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  User
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Email
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Joined Date
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Current Role
                </TableHead>
                <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-36 text-center text-sm text-muted-foreground"
                  >
                    No users found matching your search or filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => {
                  const roleKey = (user.role?.toLowerCase() ||
                    "customer") as RoleType;
                  const config = ROLE_CONFIG[roleKey] || ROLE_CONFIG.customer;
                  const RoleIcon = config.icon;
                  const isCurrentAdmin =
                    currentAdminEmail &&
                    user.email?.toLowerCase() ===
                      currentAdminEmail.toLowerCase();

                  return (
                    <TableRow
                      key={user._id}
                      className="border-border/60 transition-colors hover:bg-muted/30"
                    >
                      {/* Photo & Name */}
                      <TableCell className="py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-10 rounded-xl ring-1.5 ring-amber-500/20">
                            {user.image ? (
                              <AvatarImage
                                src={user.image}
                                alt={user.name}
                                className="object-cover"
                              />
                            ) : null}
                            <AvatarFallback className="rounded-xl bg-linear-to-br from-amber-500 to-orange-500 text-xs font-bold text-white">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-foreground">
                              {user.name}
                            </p>
                            {user.area && (
                              <p className="truncate text-[11px] text-muted-foreground">
                                {user.area}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Email */}
                      <TableCell className="text-xs font-medium text-foreground py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Mail className="size-3.5 text-muted-foreground" />
                          <span className="truncate max-w-50">
                            {user.email}
                          </span>
                        </div>
                      </TableCell>

                      {/* Joined Date */}
                      <TableCell className="text-xs text-muted-foreground py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="size-3.5" />
                          <span>{formatDate(user.createdAt)}</span>
                        </div>
                      </TableCell>

                      {/* Role Badge */}
                      <TableCell className="py-3.5">
                        <Badge
                          variant="outline"
                          className={cn(
                            "gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
                            config.badgeClass,
                          )}
                        >
                          <RoleIcon className="size-3" />
                          {config.label}
                        </Badge>
                      </TableCell>

                      {/* Change Role Dropdown Action */}
                      <TableCell className="text-right py-3.5">
                        {isCurrentAdmin ? (
                          <span
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground/60 italic"
                            title="You cannot change your own role"
                          >
                            <ShieldAlert className="size-3.5" />
                            Current User
                          </span>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 rounded-xl gap-1.5 text-xs font-semibold border-border/80 hover:border-amber-500/50"
                                />
                              }
                            >
                              <span>Change Role</span>
                              <ChevronDown className="size-3 text-muted-foreground" />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                              align="end"
                              sideOffset={6}
                              className="w-44 rounded-xl p-1 shadow-lg"
                            >
                              <DropdownMenuGroup>
                                <DropdownMenuLabel className="text-[10px] uppercase font-bold text-muted-foreground px-2 py-1">
                                  Assign New Role
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                {(
                                  [
                                    "customer",
                                    "technician",
                                    "admin",
                                  ] as RoleType[]
                                ).map((r) => {
                                  const rConfig = ROLE_CONFIG[r];
                                  const RIcon = rConfig.icon;
                                  const isSelected = roleKey === r;

                                  return (
                                    <DropdownMenuItem
                                      key={r}
                                      onClick={() => handleRoleChange(user, r)}
                                      className={cn(
                                        "flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-xs cursor-pointer",
                                        isSelected && "font-bold bg-muted",
                                      )}
                                    >
                                      <span className="flex items-center gap-2">
                                        <RIcon className="size-3.5 text-muted-foreground" />
                                        {rConfig.label}
                                      </span>
                                      {isSelected && (
                                        <Check className="size-3 text-amber-500" />
                                      )}
                                    </DropdownMenuItem>
                                  );
                                })}
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile View: Cards */}
        <div className="divide-y divide-border/60 md:hidden">
          {filteredUsers.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No users found matching your search.
            </div>
          ) : (
            filteredUsers.map((user) => {
              const roleKey = (user.role?.toLowerCase() ||
                "customer") as RoleType;
              const config = ROLE_CONFIG[roleKey] || ROLE_CONFIG.customer;
              const RoleIcon = config.icon;
              const isCurrentAdmin =
                currentAdminEmail &&
                user.email?.toLowerCase() === currentAdminEmail.toLowerCase();

              return (
                <div key={user._id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="size-10 rounded-xl ring-1.5 ring-amber-500/20">
                        {user.image ? (
                          <AvatarImage
                            src={user.image}
                            alt={user.name}
                            className="object-cover"
                          />
                        ) : null}
                        <AvatarFallback className="rounded-xl bg-linear-to-br from-amber-500 to-orange-500 text-xs font-bold text-white">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-foreground">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className={cn(
                        "gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold shrink-0 capitalize",
                        config.badgeClass,
                      )}
                    >
                      <RoleIcon className="size-3" />
                      {config.label}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3 text-muted-foreground" />
                      Joined {formatDate(user.createdAt)}
                    </span>

                    {isCurrentAdmin ? (
                      <span className="text-[10px] italic text-muted-foreground">
                        Your account
                      </span>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 rounded-lg text-xs font-medium px-2.5 gap-1"
                            />
                          }
                        >
                          <span>Role</span>
                          <ChevronDown className="size-3" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-40 rounded-xl p-1"
                        >
                          <DropdownMenuGroup>
                            {(
                              ["customer", "technician", "admin"] as RoleType[]
                            ).map((r) => (
                              <DropdownMenuItem
                                key={r}
                                onClick={() => handleRoleChange(user, r)}
                                className="text-xs cursor-pointer capitalize"
                              >
                                {r}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
