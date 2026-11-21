import { Suspense } from "react";
import SectionHeading from "@/components/section-heading";
import ServicesFilters from "@/components/services/services-filters";
import ServicesResults from "@/components/services/services-results";
import { ServicesGridSkeleton } from "@/components/services/service-card-skeleton";

export const metadata = { title: "Services | FixMate" };

const pick = (value) => (Array.isArray(value) ? value[0] : value) || "";

export default async function ServicesPage({ searchParams }) {
  const raw = await searchParams;

  const filters = {
    search: pick(raw.search),
    category: pick(raw.category),
    mode: pick(raw.mode),
    sort: pick(raw.sort),
    page: pick(raw.page),
    limit: pick(raw.limit),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <SectionHeading
        eyebrow="Browse & book"
        title="All Repair Services"
        description="Search, filter and sort to find the right technician for your device."
      />

      <div className="mt-10">
        <Suspense fallback={<div className="h-[76px] rounded-2xl border bg-card" />}>
          <ServicesFilters />
        </Suspense>
      </div>

      <div className="mt-8">
        <Suspense key={JSON.stringify(filters)} fallback={<ServicesGridSkeleton />}>
          <ServicesResults filters={filters} />
        </Suspense>
      </div>
    </div>
  );
}