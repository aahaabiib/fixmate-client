"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2, XCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function PaymentCancel() {
  const bookingId = useSearchParams().get("booking_id");
  const [loading, setLoading] = useState(false);

  async function tryAgain() {
    setLoading(true);
    try {
      const res = await apiFetch("/api/payments/create-checkout-session", {
        method: "POST",
        body: { bookingId },
      });
      window.location.href = res.url;
    } catch (err) {
      toast.error(err.message || "Could not start the payment");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg items-center justify-center px-4 py-16">
      <div className="w-full rounded-2xl border bg-card p-8 text-center shadow-sm">
        <XCircle className="mx-auto size-14 text-amber-500" />
        <h1 className="mt-4 text-2xl font-bold">Payment cancelled</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          No money was charged. You can try again whenever you are ready.
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          {bookingId ? (
            <Button
              onClick={tryAgain}
              disabled={loading}
              className="bg-orange-500 text-white hover:bg-orange-600"
            >
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Try again
            </Button>
          ) : (
            <Button asChild className="bg-orange-500 text-white hover:bg-orange-600">
              <Link href="/dashboard/customer/bookings">Try again</Link>
            </Button>
          )}
          <Button asChild variant="outline">
            <Link href="/dashboard/customer/bookings">Back to my bookings</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}