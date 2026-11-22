"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { useCurrentUser } from "@/hooks/use-current-user";
import ServiceForm from "@/components/dashboard/technician/service-form";

export default function AddServiceForm() {
  const { user } = useCurrentUser();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(values) {
    setSubmitting(true);
    try {
      await apiFetch("/api/services", { method: "POST", body: values });
      toast.success("Service submitted! Waiting for admin approval.");
      router.push("/dashboard/technician/my-services");
    } catch (err) {
      toast.error(err.message || "Could not add service");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-card p-5 sm:p-6">
      <ServiceForm
        user={user}
        submitLabel="Submit for approval"
        submitting={submitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
}