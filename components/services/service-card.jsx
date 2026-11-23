import Link from "next/link";
import { Clock, Home, MapPin, Star, Store, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceImage from "./service-image";

export default function ServiceCard({ service }) {
  const ModeIcon = service.serviceMode === "Home Visit" ? Home : Store;
  const rating = Number(service.averageRating) || 0;
  const reviewCount = Number(service.reviewCount) || 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <ServiceImage
          src={service.image}
          alt={service.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-navy px-3 py-1 text-xs font-semibold text-navy-foreground shadow">
          {service.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 min-h-[3rem] text-base font-bold leading-snug">
          {service.title}
        </h3>

        <div className="mt-1 flex items-center justify-between gap-2 text-sm text-muted-foreground">
          <p className="flex min-w-0 items-center gap-1.5">
            <UserRound className="size-4 shrink-0" />
            <span className="line-clamp-1">{service.technicianName}</span>
          </p>

          {reviewCount > 0 ? (
            <span
              className="flex shrink-0 items-center gap-1 font-semibold text-foreground"
              aria-label={`Rated ${rating} out of 5 from ${reviewCount} reviews`}
            >
              <Star className="size-4 fill-primary text-primary" />
              {rating.toFixed(1)}
              <span className="font-normal text-muted-foreground">
                ({reviewCount})
              </span>
            </span>
          ) : (
            <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              New
            </span>
          )}
        </div>

        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <ModeIcon className="size-4 shrink-0 text-primary" />
            {service.serviceMode}
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-primary" />
            <span className="line-clamp-1">{service.serviceArea}</span>
          </li>
          <li className="flex items-center gap-2">
            <Clock className="size-4 shrink-0 text-primary" />
            {service.estimatedDuration}
          </li>
        </ul>

        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between gap-3 border-t pt-4">
            <div>
              <p className="text-xs text-muted-foreground">Starts at</p>
              <p className="text-xl font-extrabold text-primary">
                ${service.basePrice}
              </p>
            </div>
            <Button asChild size="sm">
              <Link href={`/services/${service._id}`}>View Details</Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}