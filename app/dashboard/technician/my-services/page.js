import PageHeader from "@/components/dashboard/page-header";
import MyServices from "@/components/dashboard/technician/my-services";

export const instant = false;

export const metadata = { title: "My Services | FixMate" };

export default function MyServicesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My services"
        description="Manage your services, prices and availability."
      />
      <MyServices />
    </div>
  );
}