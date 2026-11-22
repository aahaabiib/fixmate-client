import PageHeader from "@/components/dashboard/page-header";
import WelcomeBanner from "@/components/dashboard/welcome-banner";

export const metadata = { title: "Profile | FixMate" };

export default function ProfilePage() {
  return (
    <>
      <PageHeader title="My Profile" description="Update your name, photo and contact details." />
      <WelcomeBanner />
    </>
  );
}