"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Clock, MapPin, Pencil, Plus, Trash2, Wrench } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import { useApiData } from "@/hooks/use-api-data";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EmptyState from "@/components/empty-state";
import StatusBadge from "@/components/status-badge";
import ConfirmDialog from "@/components/confirm-dialog";
import ServiceImage from "@/components/services/service-image";
import ServiceForm from "@/components/dashboard/technician/service-form";

function ListSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-80 rounded-2xl" />
      ))}
    </div>
  );
}

export default function MyServices() {
  const { user } = useCurrentUser();
  const { data, error, loading, reload } = useApiData("/api/services/mine");

  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const services = data?.services ?? [];

  async function toggleAvailability(service, isAvailable) {
    setBusyId(service._id);
    try {
      await apiFetch(`/api/services/${service._id}/availability`, {
        method: "PATCH",
        body: { isAvailable },
      });
      toast.success(isAvailable ? "Service is now available" : "Service marked unavailable");
      await reload();
    } catch (err) {
      toast.error(err.message || "Could not update availability");
    } finally {
      setBusyId(null);
    }
  }

  async function handleEdit(values) {
    setSaving(true);
    try {
      await apiFetch(`/api/services/${editing._id}`, { method: "PATCH", body: values });
      toast.success("Service updated. It needs admin approval again.");
      setEditing(null);
      await reload();
    } catch (err) {
      toast.error(err.message || "Could not update service");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const target = deleting;
    setDeleting(null);
    try {
      await apiFetch(`/api/services/${target._id}`, { method: "DELETE" });
      toast.success("Service deleted");
      await reload();
    } catch (err) {
      toast.error(err.message || "Could not delete service");
    }
  }

  if (loading) return <ListSkeleton />;

  if (error) {
    return (
      <EmptyState
        icon={Wrench}
        title="Could not load your services"
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
        title="You have not added any service yet"
        description="Add your first service and start getting repair requests."
      >
        <Button asChild className="bg-orange-500 text-white hover:bg-orange-600">
          <Link href="/dashboard/technician/add-service">Add your first service</Link>
        </Button>
      </EmptyState>
    );
  }

  return (
    <>
      <div className="mb-5 flex justify-end">
        <Button asChild className="bg-orange-500 text-white hover:bg-orange-600">
          <Link href="/dashboard/technician/add-service">
            <Plus className="mr-2 size-4" /> Add service
          </Link>
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <div
            key={service._id}
            className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card"
          >
            <ServiceImage
              src={service.image}
              alt={service.title}
              className="aspect-[16/10] w-full object-cover"
            />

            <div className="flex flex-1 flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="line-clamp-2 font-semibold">{service.title}</h3>
                <StatusBadge status={service.approvalStatus} />
              </div>

              <p className="text-sm text-muted-foreground">{service.category}</p>

              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Clock className="size-4" /> {service.estimatedDuration}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="size-4" /> {service.serviceArea}
                </p>
              </div>

              {service.approvalStatus === "pending" && (
                <p className="text-xs text-amber-600">Waiting for admin approval</p>
              )}
              {service.approvalStatus === "rejected" && (
                <p className="text-xs text-red-500">
                  Rejected by admin. Edit and resubmit.
                </p>
              )}

              <p className="mt-auto text-lg font-bold text-orange-500">
                {formatMoney(service.basePrice)}
              </p>

              <div className="flex items-center justify-between border-t pt-3">
                <label className="flex items-center gap-2 text-sm">
                  <Switch
                    checked={!!service.isAvailable}
                    disabled={busyId === service._id}
                    onCheckedChange={(v) => toggleAvailability(service, v)}
                  />
                  {service.isAvailable ? "Available" : "Unavailable"}
                </label>

                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setEditing(service)}
                    aria-label="Edit service"
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => setDeleting(service)}
                    aria-label="Delete service"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      <Dialog open={!!editing} onOpenChange={(open) => !open && !saving && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit service</DialogTitle>
            <DialogDescription>
              After saving, your service will go back to pending until the admin approves it again.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <ServiceForm
              key={editing._id}
              initial={editing}
              user={user}
              submitLabel="Save changes"
              submitting={saving}
              onSubmit={handleEdit}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete this service?"
        description={`"${deleting?.title ?? ""}" will be removed permanently. This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
      />
    </>
  );
}