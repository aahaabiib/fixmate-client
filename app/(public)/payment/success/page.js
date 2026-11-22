import { Suspense } from "react";
import PaymentSuccess from "@/components/payment/payment-success";

export const metadata = { title: "Payment Successful | FixMate" };

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <PaymentSuccess />
    </Suspense>
  );
}