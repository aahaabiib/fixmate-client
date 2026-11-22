"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Clock, Loader2, Wrench, X } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/format";
import { useApiData } from "@/hooks/use-api-data";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/empty-state";
import StatusBadge from "@/components/status-badge";
import ConfirmDialog from "@/components/confirm-dialog";
import ServiceImage from "@/components/services/service-image";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

function ListSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-80 rounded-2xl" />
      ))}
    </div>
  );
}

export default function AdminServices() {
  const { data, error, loading, reload } = useApiData("/api/admin/services");

  const [filter, setFilter] = useState("all");
  const [busyId, setBusyId] = useState(null);
  const [rejecting, setRejecting] = useState(null);

  const services = data?.services ?? [];

  const counts = services.reduce(
    (acc, s) => {
      acc[s.approvalStatus] = (acc[s.approvalStatus] || 0) + 1;
      return acc;
    },
    { all: services.length }
  );

  // pending sobar age
  const order = { pending: 0, approved: 1, rejected: 2 };
  const visible = (
    filter === "all" ? services : services.filter((s) => s.approvalStatus === filter)
  )
    .slice()
    .sort((a, b) => (order[a.approvalStatus] ?? 9) - (order[b.approvalStatus] ?? 9));

  async function setApproval(service, status) {
    setBusyId(service._id);
    try {
      await apiFetch(`/api/admin/services/${service._id}/approval`, {
        method: "PATCH",
        body: { status },
      });
      toast.success(status === "approved" ? "Service approved" : "Service rejected");
      await reload();
    } catch (err) {
      toast.error(err.message || "Could not update service");
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject() {
    const target = rejecting;
    setRejecting(null);
    await setApproval(target, "rejected");
  }

  if (loading) return <ListSkeleton />;

  if (error) {
    return (
      <EmptyState
        icon={Wrench}
        title="Could not load services"
        description={typeof error === "string" ? error : error?.message}
      >
        <Button onClick={reload}>Try again</Button>
      </EmptyState>
    );
  }

  if (services.length === 0) {
    return (
      <EmptyState
        icon={Wrench}
        title="No services yet"
        description="Services added by technicians will show up here for approval."
      />
    );
  }

  return (
    <>
      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              filter === f.value
                ? "border-orange-500 bg-orange-500 text-white"
                : "hover:border-orange-500 hover:text-orange-500"
            }`}
          >
            {f.label} ({counts[f.value] || 0})
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No services in this status"
          description="Try another filter."
        >
          <Button variant="outline" onClick={() => setFilter("all")}>
            Show all
          </Button>
        </EmptyState>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((s) => {
            const busy = busyId === s._id;
            return (
              <div
                key={s._id}
                className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card"
              >
                <ServiceImage
                  src={s.image}
                  alt={s.title}
                  className="aspect-[16/10] w-full object-cover"
                />
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 font-semibold">{s.title}</h3>
                    <StatusBadge status={s.approvalStatus} />
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {s.category} · {s.serviceMode}
                  </p>

                  <div className="text-sm">
                    <p className="font-medium">{s.technicianName}</p>
                    <p className="truncate text-xs text-muted-foreground">{s.technicianEmail}</p>
                  </div>

                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="size-3.5" />
                    {s.createdAt ? formatDate(s.createdAt) : "-"}
                    {!s.isAvailable && <span className="text-amber-600">· Unavailable</span>}
                  </p>

                  <p className="mt-auto text-lg font-bold text-orange-500">
                    {formatMoney(s.basePrice)}
                  </p>

                  <div className="flex gap-2 border-t pt-3">
                    <Button
                      size="sm"
                      disabled={busy || s.approvalStatus === "approved"}
                      onClick={() => setApproval(s, "approved")}
                      className="flex-1 bg-green-600 text-white hover:bg-green-700"
                    >
                      {busy ? (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="mr-2 size-4" />
                      )}
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy || s.approvalStatus === "rejected"}
                      onClick={() => setRejecting(s)}
                      className="flex-1 text-red-500 hover:text-red-600"
                    >
                      <X className="mr-2 size-4" /> Reject
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!rejecting}
        onOpenChange={(open) => !open && setRejecting(null)}
        title="Reject this service?"
        description={`"${rejecting?.title ?? ""}" will not be shown to customers. The technician can edit and resubmit it.`}
        confirmLabel="Reject"
        destructive
        onConfirm={handleReject}
      />
    </>
  );
}