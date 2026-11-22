import PageHeader from "@/components/dashboard/page-header";
import TechnicianRequests from "@/components/dashboard/technician/technician-requests";

export const instant = false;

export const metadata = { title: "Requests | FixMate" };

export default function TechnicianRequestsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Service requests"
        description="Accept, start and complete the jobs customers request from you."
      />
      <TechnicianRequests />
    </div>
  );
}