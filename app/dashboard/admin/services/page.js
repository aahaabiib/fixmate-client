import PageHeader from "@/components/dashboard/page-header";
import AdminServices from "@/components/dashboard/admin/admin-services";

export const instant = false;

export const metadata = { title: "Services | FixMate" };

export default function AdminServicesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Services"
        description="Review services submitted by technicians. Pending ones come first."
      />
      <AdminServices />
    </div>
  );
}