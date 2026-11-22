"use client";

import ErrorView from "@/components/error-view";

export default function Error({ error, reset }) {
  return <ErrorView error={error} reset={reset} fullScreen />;
}