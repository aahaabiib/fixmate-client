"use client";

import ErrorView from "@/components/error-view";

export default function DashboardError({ error, reset }) {
  return (
    <ErrorView
      error={error}
      reset={reset}
      homeHref="/dashboard"
      homeLabel="Back to Dashboard"
    />
  );
}