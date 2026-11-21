import Link from "next/link";
import { SearchX, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/empty-state";
import ServiceCard from "./service-card";
import Pagination from "./pagination";
import { fetchServices } from "@/lib/services-api";

export default async function ServicesResults({ filters }) {
  const { services, total, page, totalPages, failed } =
    await fetchServices(filters);

  if (failed) {
    return (
      <EmptyState
        icon={WifiOff}
        title="Could not load services"
        description="Something went wrong while contacting the server. Please try again."
      >
        <Button asChild>
          <Link href="/services">Try Again</Link>
        </Button>
      </EmptyState>
    );
  }

  if (services.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No services found"
        description="We could not find any service matching your search. Try different keywords or clear the filters."
      >
        <Button asChild>
          <Link href="/services">Clear Filters</Link>
        </Button>
      </EmptyState>
    );
  }

  return (
    <>
      <p className="mb-5 text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{services.length}</span>{" "}
        of <span className="font-semibold text-foreground">{total}</span> services
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {services.map((service) => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} filters={filters} />
    </>
  );
}