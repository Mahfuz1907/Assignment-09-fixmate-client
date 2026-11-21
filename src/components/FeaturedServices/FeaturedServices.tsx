"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, User, Wrench } from "lucide-react";
import type { IService } from "@/library/type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ServiceCardProps {
  service: IService;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const isHomeVisit = service.serviceMode === "Home Visit";

  return (
    <Card className="group flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-amber-500/40">
      <div>
        {/* Image & Badges */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
          <Image
            src={service.image}
            alt={service.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

          {/* Category Badge */}
          <div className="absolute left-3 top-3">
            <Badge className="bg-background/90 text-foreground backdrop-blur-md hover:bg-background/95 border-0 font-medium text-xs">
              {service.category}
            </Badge>
          </div>

          {/* Service Mode Badge */}
          <div className="absolute right-3 top-3">
            <Badge
              variant="outline"
              className={
                isHomeVisit
                  ? "border-emerald-500/30 bg-emerald-500/90 text-white font-medium text-xs shadow-sm"
                  : "border-sky-500/30 bg-sky-500/90 text-white font-medium text-xs shadow-sm"
              }
            >
              {service.serviceMode}
            </Badge>
          </div>

          {/* Starting Price floating over image */}
          <div className="absolute bottom-3 left-3 text-white">
            <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-300">
              Starting from
            </span>
            <div className="text-xl font-extrabold text-white">
              ${service.basePrice}
            </div>
          </div>
        </div>

        {/* Card Body */}
        <CardHeader className="p-4 pb-2">
          <CardTitle className="line-clamp-1 text-base font-bold text-foreground transition-colors group-hover:text-amber-600 dark:group-hover:text-amber-400">
            {service.title}
          </CardTitle>
          <p className="line-clamp-2 mt-1 text-xs text-muted-foreground leading-relaxed">
            {service.description}
          </p>
        </CardHeader>

        {/* Details & Metadata */}
        <CardContent className="space-y-2 p-4 pt-0 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="size-3.5 shrink-0 text-amber-500" />
            <span className="truncate">
              Technician:{" "}
              <strong className="font-medium text-foreground">
                {service.technicianName}
              </strong>
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 text-[11px]">
            <span className="flex items-center gap-1 truncate">
              <MapPin className="size-3 shrink-0 text-muted-foreground" />
              {service.serviceArea}
            </span>
            <span className="flex shrink-0 items-center gap-1 font-medium text-foreground">
              <Clock className="size-3 text-muted-foreground" />
              {service.estimatedDuration}
            </span>
          </div>
        </CardContent>
      </div>

      {/* Card Footer with Equal Heights button */}
      <CardFooter className="border-t border-border/50 bg-muted/20 p-4 pt-3">
        <Button
          render={<Link href={`/services/${service._id}`} />}
          variant="outline"
          className="w-full justify-between rounded-xl group/btn border-border/80 font-medium hover:border-amber-500 hover:bg-amber-500 hover:text-white dark:hover:text-white transition-all text-xs sm:text-sm"
        >
          <span>View Details</span>
          <ArrowRight className="size-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}

interface FeaturedServicesProps {
  initialServices?: IService[];
}

export function FeaturedServices({ initialServices }: FeaturedServicesProps) {
  return (
    <section className="py-16 sm:py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:items-end">
          <div className="text-center md:text-left">
            <Badge
              variant="outline"
              className="mb-2.5 inline-flex items-center gap-1 rounded-full border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400"
            >
              <Wrench className="size-3" />
              Verified & Top Rated
            </Badge>
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Featured Repair Services
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
              Explore our most requested repair and maintenance services handled
              by top-rated certified technicians.
            </p>
          </div>

          <Link href="/services">
            <Button
              variant="outline"
              className="hidden rounded-xl md:flex gap-1.5 font-semibold"
            >
              View All Services
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>

        {/* Services Grid (6 Latest services equal height and width) */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {initialServices?.map((service) => (
            <div key={service._id} className="h-full">
              <ServiceCard service={service} />
            </div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 flex justify-center md:hidden">
          <Link href="/services" className="w-full">
            <Button
              variant="outline"
              className="w-full rounded-xl gap-2 font-semibold"
            >
              View All Services
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedServices;
