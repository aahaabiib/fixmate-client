"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/format";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";

export default function PaymentSuccess() {
  const sessionId = useSearchParams().get("session_id");
  const { user, isPending } = useCurrentUser();
  const [state, setState] = useState({ status: "loading", payment: null, message: "" });

  useEffect(() => {
    if (isPending) return;

    if (!sessionId) {
      setState({ status: "error", payment: null, message: "Payment session is missing." });
      return;
    }
    if (!user) {
      setState({ status: "error", payment: null, message: "Please sign in to see your payment." });
      return;
    }

    let cancelled = false;
    apiFetch(`/api/payments/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => {
        if (!cancelled) setState({ status: "success", payment: res.payment, message: "" });
      })
      .catch((err) => {
        if (!cancelled)
          setState({
            status: "error",
            payment: null,
            message: err.message || "Could not verify the payment.",
          });
      });

    return () => {
      cancelled = true;
    };
  }, [sessionId, isPending, user]);

  const { status, payment, message } = state;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg items-center justify-center px-4 py-16">
      <div className="w-full rounded-2xl border bg-card p-8 text-center shadow-sm">
        {status === "loading" && (
          <>
            <Loader2 className="mx-auto size-12 animate-spin text-orange-500" />
            <h1 className="mt-4 text-xl font-bold">Confirming your payment...</h1>
            <p className="mt-1 text-sm text-muted-foreground">Please do not close this page.</p>
          </>
        )}

        {status === "success" && payment && (
          <>
            <CheckCircle2 className="mx-auto size-14 text-green-500" />
            <h1 className="mt-4 text-2xl font-bold">Payment successful!</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Thank you. Your payment has been received.
            </p>

            <dl className="mt-6 space-y-3 rounded-xl bg-muted/50 p-4 text-left text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Service</dt>
                <dd className="text-right font-medium">{payment.serviceTitle}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Amount paid</dt>
                <dd className="font-bold text-green-600 dark:text-green-400">
                  {formatMoney(payment.amount)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Transaction ID</dt>
                <dd className="break-all text-right font-mono text-xs">{payment.transactionId}</dd>
              </div>
              {payment.paidAt && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Date</dt>
                  <dd className="text-right">{formatDate(payment.paidAt)}</dd>
                </div>
              )}
            </dl>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button asChild className="bg-orange-500 text-white hover:bg-orange-600">
                <Link href="/dashboard/customer/payments">View payment history</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/customer/bookings">My bookings</Link>
              </Button>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="mx-auto size-14 text-red-500" />
            <h1 className="mt-4 text-2xl font-bold">Could not confirm payment</h1>
            <p className="mt-1 text-sm text-muted-foreground">{message}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              If money was deducted, it will show in your bookings shortly.
            </p>
            <Button asChild className="mt-6">
              <Link href="/dashboard/customer/bookings">Go to my bookings</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}