import PageHeader from "@/components/dashboard/page-header";
import PaymentHistory from "@/components/dashboard/customer/payment-history";

export const instant = false;
export const metadata = { title: "Payment History | FixMate" };

export default function CustomerPaymentsPage() {
  return (
    <>
      <PageHeader
        title="Payment History"
        description="All payments you have made on FixMate."
      />
      <PaymentHistory />
    </>
  );
}