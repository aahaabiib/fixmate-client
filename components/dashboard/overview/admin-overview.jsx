"use client";

import {
  CalendarCheck,
  DollarSign,
  ShieldCheck,
  UserCheck,
  Users,
  Wrench,
} from "lucide-react";
import { useApiData } from "@/hooks/use-api-data";
import ChartCard from "../chart-card";
import ErrorState from "../error-state";
import OverviewSkeleton from "../overview-skeleton";
import SimpleBarChart from "../simple-bar-chart";
import StatsCard from "../stats-card";
import StatusDonut from "../status-donut";
import WelcomeBanner from "../welcome-banner";

export default function AdminOverview() {
  const { data, error, loading, reload } = useApiData("/api/admin/stats");

  if (loading) return <OverviewSkeleton cards={6} />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const categories = data.servicesByCategory.map((c) => ({
    name: c.category,
    count: c.count,
  }));

  return (
    <div className="space-y-6">
      <WelcomeBanner />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard label="Total Users" value={data.totalUsers} icon={Users} tone="blue" />
        <StatsCard label="Total Technicians" value={data.totalTechnicians} icon={Wrench} tone="indigo" />
        <StatsCard label="Pending Services" value={data.pendingServices} icon={ShieldCheck} tone="amber" />
        <StatsCard label="Total Customers" value={data.totalCustomers} icon={UserCheck} tone="orange" />
        <StatsCard label="Total Bookings" value={data.totalBookings} icon={CalendarCheck} tone="green" />
        <StatsCard label="Total Revenue" value={`$${data.totalRevenue}`} icon={DollarSign} tone="green" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Bookings by status" description="All bookings on the platform">
          <StatusDonut data={data.bookingsByStatus} />
        </ChartCard>
        <ChartCard title="Services by category" description="All service listings">
          <SimpleBarChart data={categories} />
        </ChartCard>
      </div>
    </div>
  );
}