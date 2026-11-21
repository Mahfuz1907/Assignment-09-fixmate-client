import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, User, Wrench } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { IService } from "@/library/type";

const PRICE_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function ServiceBrowseCard({ service }: { service: IService }) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl">
      <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
        {service.image ? (
          <Image
            src={service.image}
            alt={service.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <Wrench className="size-7" aria-hidden="true" />
          </div>
        )}

        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          <Badge
            variant="secondary"
            className="rounded-full bg-background/90 px-2.5 text-[11px] font-semibold text-foreground shadow-sm backdrop-blur"
          >
            {service.category}
          </Badge>
          <Badge
            variant="secondary"
            className="rounded-full bg-background/90 px-2.5 text-[11px] font-medium text-muted-foreground shadow-sm backdrop-blur"
          >
            {service.serviceMode}
          </Badge>
        </div>
      </div>

      <CardHeader className="gap-1 p-4 pb-0">
        <h3
          title={service.title}
          className="line-clamp-2 text-sm font-bold leading-5 tracking-tight text-foreground"
        >
          {service.title}
        </h3>
      </CardHeader>

      <CardContent className="flex grow flex-col gap-2 p-4 pt-3">
        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <User className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{service.technicianName}</span>
        </p>
        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">
            {service.serviceArea || "Service area not set"}
          </span>
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <p className="leading-none">
            <span className="text-lg font-extrabold tracking-tight text-foreground">
              {PRICE_FORMATTER.format(service.basePrice)}
            </span>
            <span className="ml-1 text-[10px] font-medium text-muted-foreground">
              starting
            </span>
          </p>
          {service.estimatedDuration ? (
            <p className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
              <Clock className="size-3" aria-hidden="true" />
              {service.estimatedDuration}
            </p>
          ) : null}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          render={
            <Link
              href={`/services/${service._id ?? ""}`}
              aria-label={`View details for ${service.title}`}
            />
          }
          nativeButton={false}
          variant="outline"
          className="h-10 w-full gap-1.5 rounded-xl border-border/70 text-xs font-semibold transition-colors group-hover:border-amber-500/50 group-hover:bg-amber-500/10 group-hover:text-amber-700 dark:group-hover:text-amber-300"
        >
          View Details
          <ArrowRight
            className="size-3.5 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ServiceBrowseCard;
