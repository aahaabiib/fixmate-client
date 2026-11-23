"use client";

import { useState } from "react";
import {
  Ban,
  Check,
  ChevronDown,
  ClipboardList,
  CreditCard,
  UserCheck,
  Wrench,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PIPELINE = ["requested", "accepted", "in-progress", "completed"];

const STEP_META = {
  requested: { label: "Request sent", icon: ClipboardList },
  accepted: { label: "Accepted by technician", icon: UserCheck },
  "in-progress": { label: "Work in progress", icon: Wrench },
  completed: { label: "Job completed", icon: Check },
  rejected: { label: "Rejected by technician", icon: XCircle },
  cancelled: { label: "Request cancelled", icon: Ban },
  payment: { label: "Payment", icon: CreditCard },
};

function formatDateTime(value) {
  if (!value) return "";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function buildSteps(booking) {
  const history = Array.isArray(booking.statusHistory)
    ? booking.statusHistory
    : [];
  const dateOf = (status) =>
    history.find((h) => h.status === status)?.changedAt ||
    (status === "requested" ? booking.createdAt : null);

  // Rejected / cancelled hole pipeline er baki step dekhanor dorkar nai
  if (booking.status === "rejected" || booking.status === "cancelled") {
    return [
      { key: "requested", state: "done", date: dateOf("requested") },
      { key: booking.status, state: "bad", date: dateOf(booking.status) },
    ];
  }

  const current = PIPELINE.indexOf(booking.status);
  const isCompleted = booking.status === "completed";

  const steps = PIPELINE.map((key, i) => {
    let state = "todo";
    if (i < current || (isCompleted && i === current)) state = "done";
    else if (i === current) state = "current";
    return { key, state, date: i <= current ? dateOf(key) : null };
  });

  const paid = booking.paymentStatus === "paid";
  steps.push({
    key: "payment",
    state: paid ? "done" : isCompleted ? "current" : "todo",
    date: null,
    label: paid
      ? "Payment received"
      : isCompleted
        ? "Waiting for payment"
        : "Payment after completion",
  });

  return steps;
}

export default function BookingTimeline({ booking }) {
  const steps = buildSteps(booking);

  return (
    <ol className="relative">
      {steps.map((step, i) => {
        const meta = STEP_META[step.key];
        const Icon = meta.icon;
        const isLast = i === steps.length - 1;

        return (
          <li key={step.key} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast && (
              <span
                className={cn(
                  "absolute bottom-0 left-4 top-8 w-0.5 -translate-x-1/2",
                  step.state === "done" ? "bg-primary" : "bg-border"
                )}
              />
            )}

            <span
              className={cn(
                "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2",
                step.state === "done" &&
                  "border-primary bg-primary text-primary-foreground",
                step.state === "current" &&
                  "border-primary bg-primary/10 text-primary",
                step.state === "todo" &&
                  "border-border bg-card text-muted-foreground",
                step.state === "bad" &&
                  "border-red-500 bg-red-500/10 text-red-500"
              )}
            >
              <Icon className="size-4" />
            </span>

            <div className="min-w-0 pt-1">
              <p
                className={cn(
                  "text-sm font-semibold",
                  step.state === "todo" && "text-muted-foreground",
                  step.state === "bad" && "text-red-500"
                )}
              >
                {step.label || meta.label}
              </p>
              {step.date ? (
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(step.date)}
                </p>
              ) : step.state === "current" ? (
                <p className="text-xs text-primary">In progress now</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

// Card er niche button + khola/bondho timeline
export function TimelineToggle({ booking }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-2 rounded-xl border bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium"
      >
        Track progress
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="border-t px-4 py-5">
          <BookingTimeline booking={booking} />
        </div>
      )}
    </div>
  );
}