import { Skeleton } from "@/components/ui/skeleton";
import { ServicesGridSkeleton } from "@/components/services/service-card-skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-4 w-80" />
      </div>
      <Skeleton className="mt-10 h-[76px] w-full rounded-2xl" />
      <div className="mt-8">
        <ServicesGridSkeleton />
      </div>
    </div>
  );
}