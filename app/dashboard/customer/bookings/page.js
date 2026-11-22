import PageHeader from "@/components/dashboard/page-header";
import MyBookings from "@/components/dashboard/customer/my-bookings";

export const instant = false;
export const metadata = { title: "My Bookings | FixMate" };

export default function CustomerBookingsPage() {
  return (
    <>
      <PageHeader
        title="My Bookings"
        description="Track, cancel and pay for your repair requests."
      />
      <MyBookings />
    </>
  );
}