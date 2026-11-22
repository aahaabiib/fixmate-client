import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-muted/30">
      <aside className="fixed inset-y-0 left-0 hidden w-64 bg-navy lg:block" />
      <div className="lg:pl-64">
        <div className="flex h-16 items-center justify-end gap-3 border-b bg-background px-6">
          <Skeleton className="size-9 rounded-full" />
          <Skeleton className="hidden h-9 w-32 md:block" />
        </div>
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
          <Skeleton className="h-9 w-64" />
          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}