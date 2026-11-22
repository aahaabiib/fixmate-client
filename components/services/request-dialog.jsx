"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiFetch } from "@/lib/api";

// Dashboard step-e ei path final korbo. Bodlate hole shudhu ekhane bodlalei hobe.
const MY_BOOKINGS_URL = "/dashboard/customer/bookings";

const INITIAL = {
  phone: "",
  address: "",
  preferredDate: "",
  problemDescription: "",
};

// Local timezone-er aj-er date, YYYY-MM-DD format-e
function todayLocal() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

function validate(form) {
  const errors = {};
  if (!/^[0-9+\-\s]{7,16}$/.test(form.phone.trim())) {
    errors.phone = "Enter a valid phone number";
  }
  if (form.address.trim().length < 5) {
    errors.address = "Address must be at least 5 characters";
  }
  if (!form.preferredDate) {
    errors.preferredDate = "Preferred date is required";
  } else if (form.preferredDate < todayLocal()) {
    errors.preferredDate = "Date must be today or a future date";
  }
  if (form.problemDescription.trim().length < 20) {
    errors.problemDescription =
      "Describe the problem in at least 20 characters";
  }
  return errors;
}

function Field({ label, error, hint, children }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

export default function RequestDialog({ service, user }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      await apiFetch("/api/bookings", {
        method: "POST",
        body: {
          serviceId: service._id,
          customerPhone: form.phone.trim(),
          address: form.address.trim(),
          preferredDate: form.preferredDate,
          problemDescription: form.problemDescription.trim(),
        },
      });

      toast.success("Repair request sent!", {
        description: "The technician will review your request soon.",
        action: {
          label: "My Bookings",
          onClick: () => router.push(MY_BOOKINGS_URL),
        },
      });
      setForm(INITIAL);
      setErrors({});
      setOpen(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !submitting && setOpen(v)}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full">
          <Wrench className="size-4" /> Request Repair
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Request a repair</DialogTitle>
          <DialogDescription>
            {service.title} · starts at ${service.basePrice}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Your name">
              <Input value={user.name || ""} readOnly className="bg-muted" />
            </Field>
            <Field label="Email">
              <Input value={user.email || ""} readOnly className="bg-muted" />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone number" error={errors.phone}>
              <Input
                type="tel"
                placeholder="01XXXXXXXXX"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
              />
            </Field>
            <Field label="Preferred date" error={errors.preferredDate}>
              <Input
                type="date"
                min={todayLocal()}
                value={form.preferredDate}
                onChange={(e) => setField("preferredDate", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Address" error={errors.address}>
            <Input
              placeholder="House, road, area, city"
              value={form.address}
              onChange={(e) => setField("address", e.target.value)}
            />
          </Field>

          <Field
            label="Describe the problem"
            error={errors.problemDescription}
            hint={`${form.problemDescription.trim().length} / 20 minimum characters`}
          >
            <Textarea
              rows={4}
              placeholder="What is wrong with your device? When did it start?"
              value={form.problemDescription}
              onChange={(e) => setField("problemDescription", e.target.value)}
            />
          </Field>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {submitting ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}