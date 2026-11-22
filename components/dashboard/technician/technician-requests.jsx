"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Loader2,
  MapPin,
  Phone,
  Play,
  User,
  X,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/format";
import { BOOKING_STATUSES, STATUS_META } from "@/lib/status";
import { useApiData } from "@/hooks/use-api-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EmptyState from "@/components/empty-state";
import StatusBadge from "@/components/status-badge";
import ConfirmDialog from "@/components/confirm-dialog";
import ServiceImage from "@/components/services/service-image";

const labelOf = (s) => STATUS_META[s]?.label ?? s;

function ListSkeleton() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-72 rounded-2xl" />
      ))}
    </div>
  );
}

function CompleteDialog({ booking, busy, onClose, onSubmit }) {
  const [amount, setAmount] = useState(String(booking.finalAmount ?? booking.basePrice ?? ""));
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const value = Number(amount);
    if (!(value > 0)) {
      setError("Final amount must be greater than 0");
      return;
    }
    onSubmit(value);
  }

  return (
    <Dialog open onOpenChange={(open) => !open && !busy && onClose()}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Mark job as completed</DialogTitle>
            <DialogDescription>
              Confirm the final amount for &quot;{booking.serviceTitle}&quot;. The customer will pay
              this amount.
            </DialogDescription>
          </DialogHeader>

          <div className="my-5 space-y-2">
            <Label htmlFor="finalAmount">Final amount (USD)</Label>
            <Input
              id="finalAmount"
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError("");
              }}
            />
            <p className="text-xs text-muted-foreground">
              Base price: {formatMoney(booking.basePrice)}
            </p>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={busy}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={busy}
              className="bg-orange-500 text-white hover:bg-orange-600"
            >
              {busy && <Loader2 className="mr-2 size-4 animate-spin" />}
              Mark completed
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function TechnicianRequests() {
  const { data, error, loading, reload } = useApiData("/api/bookings/technician");

  const [filter, setFilter] = useState("all");
  const [busyId, setBusyId] = useState(null);
  const [rejecting, setRejecting] = useState(null);
  const [completing, setCompleting] = useState(null);

  const bookings = data?.bookings ?? [];

  const counts = bookings.reduce(
    (acc, b) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    },
    { all: bookings.length }
  );

  const visible = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  async function updateStatus(booking, status, extra = {}, successMessage) {
    setBusyId(booking._id);
    try {
      await apiFetch(`/api/bookings/${booking._id}/status`, {
        method: "PATCH",
        body: { status, ...extra },
      });
      toast.success(successMessage || `Status changed to ${labelOf(status)}`);
      setCompleting(null);
      await reload();
    } catch (err) {
      toast.error(err.message || "Could not update status");
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject() {
    const target = rejecting;
    setRejecting(null);
    await updateStatus(target, "rejected", {}, "Request rejected");
  }

  if (loading) return <ListSkeleton />;

  if (error) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Could not load requests"
        description={typeof error === "string" ? error : error?.message}
      >
        <Button onClick={reload}>Try again</Button>
      </EmptyState>
    );
  }

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No requests yet"
        description="When customers request your services, they will show up here."
      />
    );
  }

  return (
    <>
      {/* Filter pills */}
      <div className="mb-5 flex flex-wrap gap-2">
        {["all", ...BOOKING_STATUSES].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              filter === s
                ? "border-orange-500 bg-orange-500 text-white"
                : "hover:border-orange-500 hover:text-orange-500"
            }`}
          >
            {s === "all" ? "All" : labelOf(s)} ({counts[s] || 0})
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No requests in this status"
          description="Try another filter."
        >
          <Button variant="outline" onClick={() => setFilter("all")}>
            Show all
          </Button>
        </EmptyState>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {visible.map((b) => {
            const busy = busyId === b._id;
            return (
              <div key={b._id} className="flex h-full flex-col rounded-2xl border bg-card p-4">
                <div className="flex gap-3">
                  <ServiceImage
                    src={b.serviceImage}
                    alt={b.serviceTitle}
                    className="size-20 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="line-clamp-2 font-semibold">{b.serviceTitle}</h3>
                      <StatusBadge status={b.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">{b.category}</p>
                    <p className="mt-1 text-sm">
                      Base {formatMoney(b.basePrice)}
                      {b.status === "completed" && (
                        <>
                          {" "}
                          · Final{" "}
                          <span className="font-semibold text-orange-500">
                            {formatMoney(b.finalAmount ?? b.basePrice)}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <User className="size-4 shrink-0" /> {b.customerName}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="size-4 shrink-0" />
                    <a href={`tel:${b.customerPhone}`} className="hover:text-orange-500">
                      {b.customerPhone}
                    </a>
                  </p>
                  <p className="flex items-start gap-2">
                    <MapPin className="mt-0.5 size-4 shrink-0" /> {b.address}
                  </p>
                  <p className="flex items-center gap-2">
                    <CalendarDays className="size-4 shrink-0" /> {formatDate(b.preferredDate)}
                  </p>
                </div>

                <p className="mt-3 line-clamp-3 rounded-lg bg-muted/50 p-3 text-sm">
                  {b.problemDescription}
                </p>

                <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
                  {b.status === "requested" && (
                    <>
                      <Button
                        size="sm"
                        disabled={busy}
                        onClick={() => updateStatus(b, "accepted", {}, "Request accepted")}
                        className="bg-green-600 text-white hover:bg-green-700"
                      >
                        {busy ? (
                          <Loader2 className="mr-2 size-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="mr-2 size-4" />
                        )}
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busy}
                        onClick={() => setRejecting(b)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X className="mr-2 size-4" /> Reject
                      </Button>
                    </>
                  )}

                  {b.status === "accepted" && (
                    <Button
                      size="sm"
                      disabled={busy}
                      onClick={() => updateStatus(b, "in-progress", {}, "Work started")}
                      className="bg-orange-500 text-white hover:bg-orange-600"
                    >
                      {busy ? (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                      ) : (
                        <Play className="mr-2 size-4" />
                      )}
                      Start Work
                    </Button>
                  )}

                  {b.status === "in-progress" && (
                    <Button
                      size="sm"
                      disabled={busy}
                      onClick={() => setCompleting(b)}
                      className="bg-green-600 text-white hover:bg-green-700"
                    >
                      <CheckCircle2 className="mr-2 size-4" /> Mark Completed
                    </Button>
                  )}

                  {b.status === "completed" && (
                    <StatusBadge status={b.paymentStatus === "paid" ? "paid" : "unpaid"} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject confirm */}
      <ConfirmDialog
        open={!!rejecting}
        onOpenChange={(open) => !open && setRejecting(null)}
        title="Reject this request?"
        description={`The request from ${rejecting?.customerName ?? "the customer"} will be rejected. This cannot be undone.`}
        confirmLabel="Reject"
        destructive
        onConfirm={handleReject}
      />

      {/* Complete modal */}
      {completing && (
        <CompleteDialog
          key={completing._id}
          booking={completing}
          busy={busyId === completing._id}
          onClose={() => setCompleting(null)}
          onSubmit={(amount) =>
            updateStatus(
              completing,
              "completed",
              { finalAmount: amount },
              "Job marked as completed"
            )
          }
        />
      )}
    </>
  );
}