import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/section-heading";
import EmptyState from "@/components/empty-state";
import ServiceCard from "@/components/services/service-card";
import { fetchServices } from "@/lib/services-api";

export default async function FeaturedServices() {
  const { services } = await fetchServices({ limit: 6, sort: "newest" });

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Popular right now"
          title="Featured Services"
          description="Hand-picked repair services from verified technicians near you."
        />

        <div className="mt-10">
          {services.length === 0 ? (
            <EmptyState
              icon={Wrench}
              title="No services available yet"
              description="Technicians are adding services. Please check back soon."
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          )}
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