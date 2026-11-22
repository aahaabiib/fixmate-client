import PageHeader from "@/components/dashboard/page-header";
import ProfileForm from "@/components/dashboard/profile/profile-form";

export const instant = false;

export const metadata = { title: "My Profile | FixMate" };

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My profile"
        description="Update your name, photo and contact details."
      />
      <ProfileForm />
    </div>
  );
}