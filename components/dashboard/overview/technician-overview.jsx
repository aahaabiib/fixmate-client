"use client";

import { BadgeCheck, Inbox, Wrench } from "lucide-react";
import { useApiData } from "@/hooks/use-api-data";
import { BOOKING_STATUSES } from "@/lib/status";
import ChartCard from "../chart-card";
import ErrorState from "../error-state";
import OverviewSkeleton from "../overview-skeleton";
import RecentBookings from "../recent-bookings";
import SimpleBarChart from "../simple-bar-chart";
import StatsCard from "../stats-card";
import StatusDonut from "../status-donut";
import WelcomeBanner from "../welcome-banner";

export default function TechnicianOverview() {
  const svc = useApiData("/api/services/mine");
  const bkg = useApiData("/api/bookings/technician");

  if (svc.loading || bkg.loading) return <OverviewSkeleton />;
  if (svc.error || bkg.error) {
    return (
      <ErrorState
        message={svc.error || bkg.error}
        onRetry={() => {
          svc.reload();
          bkg.reload();
        }}
      />
    );
  }

  const services = svc.data.services;
  const bookings = bkg.data.bookings;

  const countService = (s) => services.filter((x) => x.approvalStatus === s).length;
  const approved = countService("approved");
  const pendingRequests = bookings.filter((b) => b.status === "requested").length;

  const byStatus = BOOKING_STATUSES.map((status) => ({
    status,
    count: bookings.filter((b) => b.status === status).length,
  }));

  const approvalData = [
    { name: "Approved", count: approved },
    { name: "Pending", count: countService("pending") },
    { name: "Rejected", count: countService("rejected") },
  ];

  return (
    <div className="space-y-6">
      <WelcomeBanner />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard label="Total Services" value={services.length} icon={Wrench} tone="blue" />
        <StatsCard label="Approved Services" value={approved} icon={BadgeCheck} tone="green" />
        <StatsCard label="Pending Requests" value={pendingRequests} icon={Inbox} tone="amber" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Requests by status" description="Jobs sent to you">
          <StatusDonut data={byStatus} />
        </ChartCard>
        <ChartCard title="Services by approval" description="Your service listings">
          <SimpleBarChart data={approvalData} />
        </ChartCard>
      </div>

      {bookings.length > 0 && (
        <RecentBookings
          bookings={bookings}
          viewAllHref="/dashboard/technician/requests"
          showCustomer
        />
      )}
    </div>
  );
}