import PageHeader from "@/components/dashboard/page-header";
import WelcomeBanner from "@/components/dashboard/welcome-banner";

export const metadata = { title: "Technician Dashboard | FixMate" };

export default function TechnicianDashboardPage() {
  return (
    <>
      <PageHeader title="Overview" description="Your services and incoming requests." />
      <WelcomeBanner />
    </>
  );
}