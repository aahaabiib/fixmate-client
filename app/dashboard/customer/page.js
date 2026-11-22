import PageHeader from "@/components/dashboard/page-header";
import CustomerOverview from "@/components/dashboard/overview/customer-overview";

export const metadata = { title: "Customer Dashboard | FixMate" };

export default function CustomerDashboardPage() {
  return (
    <>
      <PageHeader title="Overview" description="Your repair requests at a glance." />
      <CustomerOverview />
    </>
  );
}