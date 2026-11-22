import { Suspense } from "react";
import PaymentCancel from "@/components/payment/payment-cancel";

export const metadata = { title: "Payment Cancelled | FixMate" };

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <PaymentCancel />
    </Suspense>
  );
}