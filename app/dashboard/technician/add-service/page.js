import PageHeader from "@/components/dashboard/page-header";
import AddServiceForm from "@/components/dashboard/technician/add-service-form";

export const instant = false;

export const metadata = { title: "Add Service | FixMate" };

export default function AddServicePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add a new service"
        description="Your service will be visible to customers after admin approval."
      />
      <AddServiceForm />
    </div>
  );
}