"use client";

import Link from "next/link";
import { Activity, BadgeCheck, ClipboardList, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/empty-state";
import { useApiData } from "@/hooks/use-api-data";
import { ACTIVE_STATUSES, BOOKING_STATUSES } from "@/lib/status";
import ChartCard from "../chart-card";
import ErrorState from "../error-state";
import OverviewSkeleton from "../overview-skeleton";
import RecentBookings from "../recent-bookings";
import StatsCard from "../stats-card";
import StatusDonut from "../status-donut";
import WelcomeBanner from "../welcome-banner";

export default function CustomerOverview() {
  const { data, error, loading, reload } = useApiData("/api/bookings/my");

  if (loading) return <OverviewSkeleton />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const bookings = data.bookings;
  const byStatus = BOOKING_STATUSES.map((status) => ({
    status,
    count: bookings.filter((b) => b.status === status).length,
  }));

  const total = bookings.length;
  const active = bookings.filter((b) => ACTIVE_STATUSES.includes(b.status)).length;
  const completed = bookings.filter((b) => b.status === "completed").length;

  return (
    <div className="space-y-6">
      <WelcomeBanner />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard label="Total Requests" value={total} icon={ClipboardList} tone="blue" />
        <StatsCard label="Active Jobs" value={active} icon={Activity} tone="amber" />
        <StatsCard label="Completed Jobs" value={completed} icon={BadgeCheck} tone="green" />
      </div>

      {total === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No repair requests yet"
          description="Find a technician and send your first repair request."
        >
          <Button asChild>
            <Link href="/services">
              <Search className="size-4" /> Browse Services
            </Link>
          </Button>
        </EmptyState>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <RecentBookings
            title="Recent bookings"
            bookings={bookings}
            viewAllHref="/dashboard/customer/bookings"
          />
          <ChartCard title="Requests by status" description="All your repair requests">
            <StatusDonut data={byStatus} />
          </ChartCard>
        </div>
      )}
    </div>
  );
}