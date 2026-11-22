import PageHeader from "@/components/dashboard/page-header";
import TechnicianOverview from "@/components/dashboard/overview/technician-overview";

export const metadata = { title: "Technician Dashboard | FixMate" };

export default function TechnicianDashboardPage() {
  return (
    <>
      <PageHeader title="Overview" description="Your services and incoming requests." />
      <TechnicianOverview />
    </>
  );
}