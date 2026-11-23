import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Clock,
  Home,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Store,
  Tag,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/empty-state";
import ServiceImage from "@/components/services/service-image";
import RequestPanel from "@/components/services/request-panel";
import StarDisplay from "@/components/star-display";
import { fetchServiceById, fetchServiceReviews } from "@/lib/services-api";

export const metadata = { title: "Service Details | FixMate" };

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function ServiceDetailsPage({ params }) {
  const { id } = await params;
  const data = await fetchServiceById(id);

  if (data.notFound) notFound();

  if (data.failed) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState
          icon={WifiOff}
          title="Could not load this service"
          description="Something went wrong while contacting the server. Please try again."
        >
          <Button asChild>
            <Link href={`/services/${id}`}>Try Again</Link>
          </Button>
        </EmptyState>
      </div>
    );
  }

  const { service, technician } = data;
  const reviewData = await fetchServiceReviews(id);
  const ModeIcon = service.serviceMode === "Home Visit" ? Home : Store;
  const techName = technician?.name || service.technicianName;

  const facts = [
    { icon: Tag, label: "Category", value: service.category },
    { icon: ModeIcon, label: "Service mode", value: service.serviceMode },
    { icon: MapPin, label: "Service area", value: service.serviceArea },
    { icon: Clock, label: "Estimated time", value: service.estimatedDuration },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
      >
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="size-4" />
        <Link href="/services" className="hover:text-foreground">
          Services
        </Link>
        <ChevronRight className="size-4" />
        <span className="line-clamp-1 font-medium text-foreground">
          {service.title}
        </span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left: details */}
        <div className="space-y-8">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border bg-muted shadow-sm">
            <ServiceImage
              src={service.image}
              alt={service.title}
              className="h-full w-full object-cover"
            />
            <span className="absolute left-4 top-4 rounded-full bg-navy px-3 py-1 text-xs font-semibold text-navy-foreground shadow">
              {service.category}
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {service.title}
            </h1>

            <div className="mt-3 flex items-center gap-2 text-sm">
              {reviewData.count > 0 ? (
                <>
                  <StarDisplay value={reviewData.average} />
                  <span className="font-semibold">{reviewData.average}</span>
                  <span className="text-muted-foreground">
                    ({reviewData.count}{" "}
                    {reviewData.count === 1 ? "review" : "reviews"})
                  </span>
                </>
              ) : (
                <span className="text-muted-foreground">No reviews yet</span>
              )}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {facts.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl border bg-card p-4"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="truncate font-semibold">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <section>
            <h2 className="text-lg font-bold">About this service</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">
              {service.description}
            </p>
          </section>

          {/* Technician */}
          <section>
            <h2 className="text-lg font-bold">Your technician</h2>
            <div className="mt-3 flex items-start gap-4 rounded-2xl border bg-card p-5">
              {technician?.image ? (
                <div className="size-14 shrink-0 overflow-hidden rounded-full border">
                  <ServiceImage
                    src={technician.image}
                    alt={techName}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  {techName?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-bold">{techName}</p>
                {technician?.area && (
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-4 shrink-0" />
                    {technician.area}
                  </p>
                )}
                <p className="mt-2 text-sm text-muted-foreground">
                  {technician?.bio || "Verified repair technician on FixMate."}
                </p>
              </div>
            </div>
          </section>

          {/* Reviews */}
          <section>
            <h2 className="text-lg font-bold">Customer reviews</h2>
            {reviewData.count === 0 ? (
              <div className="mt-3 flex items-center gap-3 rounded-2xl border border-dashed bg-card p-5 text-sm text-muted-foreground">
                <MessageSquare className="size-5 shrink-0 text-primary" />
                No reviews yet. Reviews appear here after customers complete a
                job.
              </div>
            ) : (
              <div className="mt-3 space-y-3">
                {reviewData.reviews.map((r) => (
                  <div key={r._id} className="rounded-2xl border bg-card p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {r.customerName?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">
                            {r.customerName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(r.date)}
                          </p>
                        </div>
                      </div>
                      <StarDisplay value={r.rating} />
                    </div>
                    {r.review && (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {r.review}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right: price + request */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Starts at</p>
            <p className="text-4xl font-extrabold text-primary">
              ${service.basePrice}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Final price is confirmed by the technician after checking the
              problem.
            </p>

            <div className="mt-6">
              <RequestPanel
                service={{
                  _id: service._id,
                  title: service.title,
                  basePrice: service.basePrice,
                }}
              />
            </div>

            <ul className="mt-6 space-y-3 border-t pt-5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                Listing approved by FixMate admin
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                Pay securely online only after the job is completed
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                Track every status update from your dashboard
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}