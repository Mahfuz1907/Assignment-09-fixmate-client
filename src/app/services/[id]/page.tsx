import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  ChevronRight,
  Clock,
  MapPin,
  Store,
  Wrench,
  Home,
  UserRound,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GetServiceDetails } from "@/library/Action/Services";
import type { IService, ISessionUser, IUsers } from "@/library/type";
import { GetUsers } from "@/library/Action/Users";
import { GettingSessionFromServer } from "@/library/GettingSessions/GetSessionServer";
import ActionButton from "./ActionButton";
import { GetBookingsByCustomer } from "@/library/Action/Bookings";
import { getTokenFromServer } from "@/library/Action/GettingTokens/GettingTokenFromServer";

export const instant = false;

const PRICE_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

type TechnicianProfile = Pick<
  IUsers,
  "name" | "email" | "image" | "area" | "bio"
>;

interface ServiceDetailsPageProps {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({ params }: ServiceDetailsPageProps) => {
  const { id } = await params;
  const service = await GetServiceDetails(id);
  return {
    title: `${service.title} . FixMate`,
  };
};

function isService(value: unknown): value is IService {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    "title" in (value as Record<string, unknown>) &&
    "approvalStatus" in (value as Record<string, unknown>) &&
    "isAvailable" in (value as Record<string, unknown>)
  );
}

async function getTechnicianProfile(
  email: string | undefined,
): Promise<TechnicianProfile | null> {
  if (!email) {
    return null;
  }

  try {
    const token = await getTokenFromServer();
    const users: unknown = await GetUsers(token);

    // const users: unknown = await res.json();

    if (!Array.isArray(users)) {
      return null;
    }

    return (users as IUsers[]).find((user) => user.email === email) ?? null;
  } catch {
    return null;
  }
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </dt>
        <dd className="mt-0.5 text-sm font-medium text-foreground">{value}</dd>
      </div>
    </div>
  );
}

async function ServiceDetailsPage({ params }: ServiceDetailsPageProps) {
  const { id } = await params;

  let service: IService | null = null;

  try {
    const result: unknown = await GetServiceDetails(id);
    service = isService(result) ? result : null;
  } catch {
    service = null;
  }

  if (
    !service ||
    service.approvalStatus !== "approved" ||
    !service.isAvailable
  ) {
    notFound();
  }

  const technician = await getTechnicianProfile(service.technicianEmail);
  const technicianName = technician?.name || service.technicianName;
  const isHomeVisit = service.serviceMode === "Home Visit";
  const session = await GettingSessionFromServer();
  const user = session?.user as ISessionUser;
  const token = await getTokenFromServer();
  const allBookings = await GetBookingsByCustomer(user?.email, token);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 flex-wrap items-center gap-1.5 text-[11px] font-medium text-muted-foreground"
        >
          <Link href="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="size-3 opacity-60" aria-hidden="true" />
          <Link
            href="/services"
            className="transition-colors hover:text-foreground"
          >
            Services
          </Link>
          <ChevronRight className="size-3 opacity-60" aria-hidden="true" />
          <span
            aria-current="page"
            className="max-w-56 truncate text-foreground sm:max-w-sm"
          >
            {service.title}
          </span>
        </nav>

        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to services
        </Link>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-12 lg:items-start">
        {/* Large image */}
        <div className="order-1 lg:col-span-7">
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-border/70 bg-muted shadow-sm sm:aspect-16/10">
            {service.image ? (
              <Image
                src={service.image}
                alt={service.title}
                fill
                preload
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-muted-foreground">
                <Wrench className="size-10" aria-hidden="true" />
              </div>
            )}

            <div className="absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-2 p-3 sm:p-4">
              <Badge
                variant="secondary"
                className="rounded-full bg-background/90 px-3 py-1 text-[11px] font-semibold text-foreground shadow-sm backdrop-blur"
              >
                {service.category}
              </Badge>
              <Badge
                variant="secondary"
                className="gap-1.5 rounded-full bg-background/90 px-3 py-1 text-[11px] font-medium text-muted-foreground shadow-sm backdrop-blur"
              >
                {isHomeVisit ? (
                  <Home className="size-3" aria-hidden="true" />
                ) : (
                  <Store className="size-3" aria-hidden="true" />
                )}
                {service.serviceMode}
              </Badge>
            </div>
          </div>
        </div>

        {/* Summary + primary action */}
        <Card className="order-2 rounded-2xl border-border/70 shadow-sm lg:col-span-5">
          <CardContent className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="gap-1.5 rounded-full border-emerald-500/25 bg-emerald-500/10 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300"
              >
                <BadgeCheck className="size-3" aria-hidden="true" />
                Approved
              </Badge>
              <Badge
                variant="outline"
                className="gap-1.5 rounded-full border-border/70 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                <span
                  className="size-1.5 rounded-full bg-emerald-500"
                  aria-hidden="true"
                />
                Available now
              </Badge>
            </div>

            <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl">
              {service.title}
            </h1>

            <p className="mt-3 flex items-end gap-1.5">
              <span className="text-3xl font-extrabold tracking-tight text-foreground">
                {PRICE_FORMATTER.format(service.basePrice)}
              </span>
              <span className="mb-1 text-xs font-medium text-muted-foreground">
                starting price
              </span>
            </p>

            <Separator className="my-4" />

            <dl className="space-y-3">
              <DetailRow
                icon={Clock}
                label="Estimated duration"
                value={service.estimatedDuration || "To be confirmed"}
              />
              <DetailRow
                icon={isHomeVisit ? Home : Store}
                label="Service mode"
                value={service.serviceMode}
              />
              <DetailRow
                icon={MapPin}
                label="Service area"
                value={service.serviceArea || "Service area not set"}
              />
            </dl>

            {/* button here */}

            <ActionButton
              service={service}
              user={user}
              allBookings={allBookings}
            />
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              No payment until the technician confirms your request.
            </p>
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="order-3 rounded-2xl border-border/70 shadow-sm lg:col-span-7">
          <CardContent className="p-5 sm:p-6">
            <h2 className="text-base font-bold tracking-tight text-foreground">
              Service description
            </h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {service.description ||
                "The technician hasn’t added a description yet."}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="gap-1.5 rounded-full border-border/70 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
              >
                <Wrench className="size-3" aria-hidden="true" />
                {service.category}
              </Badge>
              <Badge
                variant="outline"
                className="gap-1.5 rounded-full border-border/70 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
              >
                <Clock className="size-3" aria-hidden="true" />
                {service.estimatedDuration || "Duration on request"}
              </Badge>
              <Badge
                variant="outline"
                className="gap-1.5 rounded-full border-border/70 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
              >
                <MapPin className="size-3" aria-hidden="true" />
                {service.serviceArea || "Service area not set"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Technician summary */}
        <Card className="order-4 rounded-2xl border-border/70 shadow-sm lg:col-span-5">
          <CardContent className="p-5 sm:p-6">
            <h2 className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <UserRound className="size-3.5" aria-hidden="true" />
              Your technician
            </h2>

            <div className="mt-4 flex items-center gap-3">
              <Avatar size="lg" className="size-12">
                {technician?.image ? (
                  <AvatarImage
                    src={technician.image}
                    alt={technicianName}
                    className="size-12"
                  />
                ) : null}
                <AvatarFallback className="text-sm font-semibold">
                  {getInitials(technicianName) || "FM"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold tracking-tight text-foreground">
                  {technicianName}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <MapPin className="size-3 shrink-0" aria-hidden="true" />
                  <span className="truncate">
                    {technician?.area || service.serviceArea || "Area not set"}
                  </span>
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {technician?.bio ||
                `${technicianName} is a verified FixMate technician handling ${service.category.toLowerCase()} repairs.`}
            </p>

            <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
              <BadgeCheck className="size-3.5 shrink-0" aria-hidden="true" />
              Verified by the FixMate team
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ServiceDetailsPage;
