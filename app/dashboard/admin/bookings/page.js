import PageHeader from "@/components/dashboard/page-header";
import AdminBookings from "@/components/dashboard/admin/admin-bookings";

export const instant = false;

export const metadata = { title: "Bookings | FixMate" };

export default function AdminBookingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Bookings"
        description="All service bookings on the platform (read-only)."
      />
      <AdminBookings />
    </div>
  );
}