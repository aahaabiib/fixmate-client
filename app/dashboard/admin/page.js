import PageHeader from "@/components/dashboard/page-header";
import AdminOverview from "@/components/dashboard/overview/admin-overview";

export const metadata = { title: "Admin Dashboard | FixMate" };

export default function AdminDashboardPage() {
  return (
    <>
      <PageHeader title="Overview" description="Platform activity at a glance." />
      <AdminOverview />
    </>
  );
}