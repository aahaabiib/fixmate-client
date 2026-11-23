"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ClipboardList, Search, SearchX, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/confirm-dialog";
import EmptyState from "@/components/empty-state";
import StarDisplay from "@/components/star-display";
import { useApiData } from "@/hooks/use-api-data";
import { apiFetch } from "@/lib/api";
import { BOOKING_STATUSES, STATUS_META } from "@/lib/status";
import { cn } from "@/lib/utils";
import BookingCard from "./booking-card";
import ReviewDialog from "./review-dialog";
import ErrorState from "../error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { TimelineToggle } from "@/components/booking-timeline";

export default function MyBookings() {
  const { data, error, loading, reload } = useApiData("/api/bookings/my");
  const [filter, setFilter] = useState("all");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [payingId, setPayingId] = useState(null);

  if (loading && !data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-lg" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-2xl" />
        ))}
      </div>
    );
  }
  if (error && !data) return <ErrorState message={error} onRetry={reload} />;

  const bookings = data.bookings;

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No bookings yet"
        description="You have not requested any repair. Find a technician to get started."
      >
        <Button asChild>
          <Link href="/services">
            <Search className="size-4" /> Browse Services
          </Link>
        </Button>
      </EmptyState>
    );
  }

  const counts = Object.fromEntries(
    BOOKING_STATUSES.map((s) => [s, bookings.filter((b) => b.status === s).length])
  );
  const tabs = [
    { value: "all", label: "All", count: bookings.length },
    ...BOOKING_STATUSES.map((s) => ({
      value: s,
      label: STATUS_META[s].label,
      count: counts[s],
    })),
  ];
  const visible =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  async function confirmCancel() {
    try {
      await apiFetch(`/api/bookings/${cancelTarget._id}/cancel`, {
        method: "PATCH",
      });
      toast.success("Booking cancelled");
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handlePay(booking) {
    setPayingId(booking._id);
    try {
      const res = await apiFetch("/api/payments/create-checkout-session", {
        method: "POST",
        body: { bookingId: booking._id },
      });
      if (!res.url) throw new Error("Payment link was not created");
      window.location.href = res.url;
    } catch (err) {
      toast.error(err.message);
      setPayingId(null);
    }
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setFilter(t.value)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              filter === t.value
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card hover:bg-muted"
            )}
          >
            {t.label} <span className="opacity-70">({t.count})</span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No bookings in this status"
          description="Try a different filter to see your other requests."
        >
          <Button variant="outline" onClick={() => setFilter("all")}>
            Show all
          </Button>
        </EmptyState>
      ) : (
        <div className="space-y-4">
          {visible.map((b) => (
            <div key={b._id}>
              <BookingCard
                booking={b}
                onCancel={setCancelTarget}
                onPay={handlePay}
                paying={payingId === b._id}
              />
              
              <TimelineToggle booking={b} />

              {b.status === "completed" && (
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3">
                  {b.rating ? (
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">Your rating</span>
                        <StarDisplay value={b.rating} />
                      </div>
                      {b.review && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          “{b.review}”
                        </p>
                      )}
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">
                        How was the repair? Rate your technician.
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setReviewTarget(b)}
                      >
                        <Star className="size-4" /> Rate Job
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(cancelTarget)}
        onOpenChange={(v) => !v && setCancelTarget(null)}
        title="Cancel this request?"
        description={`Your request for "${cancelTarget?.serviceTitle}" will be cancelled. You can send a new request later.`}
        confirmLabel="Yes, cancel request"
        cancelLabel="Keep it"
        destructive
        onConfirm={confirmCancel}
      />

      {reviewTarget && (
        <ReviewDialog
          key={reviewTarget._id}
          booking={reviewTarget}
          onClose={() => setReviewTarget(null)}
          onDone={reload}
        />
      )}
    </>
  );
}