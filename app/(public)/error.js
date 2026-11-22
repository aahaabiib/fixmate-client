"use client";

import ErrorView from "@/components/error-view";

export default function PublicError({ error, reset }) {
  return <ErrorView error={error} reset={reset} />;
}