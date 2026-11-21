import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/section-heading";
import EmptyState from "@/components/empty-state";
import ServiceCard from "@/components/services/service-card";
import { ServiceCardSkeleton } from "@/components/services/service-card-skeleton";
import { fetchServices } from "@/lib/services-api";

// Ei part-ta data ane, tai alada kore Suspense-er bhitore rakhlam
async function FeaturedList() {
  const { services } = await fetchServices({ limit: 6, sort: "newest" });

  if (services.length === 0) {
    return (
      <EmptyState
        icon={Wrench}
        title="No services available yet"
        description="Technicians are adding services. Please check back soon."
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <ServiceCard key={service._id} service={service} />
      ))}
    </div>
  );
}

function FeaturedSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <ServiceCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function FeaturedServices() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Popular right now"
          title="Featured Services"
          description="Hand-picked repair services from verified technicians near you."
        />

        <div className="mt-10">
          <Suspense fallback={<FeaturedSkeleton />}>
            <FeaturedList />
          </Suspense>
        </div>

        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/services">
              View All Services <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}