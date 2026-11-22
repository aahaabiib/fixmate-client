import PageHeader from "@/components/dashboard/page-header";
import WelcomeBanner from "@/components/dashboard/welcome-banner";

export const metadata = { title: "Customer Dashboard | FixMate" };

export default function CustomerDashboardPage() {
  return (
    <>
      <PageHeader title="Overview" description="Your repair requests at a glance." />
      <WelcomeBanner />
    </>
  );
}