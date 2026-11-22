"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

// Protected API theke data ane. { data, error, loading, reload } dey.
export function useApiData(path) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    apiFetch(path)
      .then((data) => {
        if (!cancelled) setState({ data, error: null, loading: false });
      })
      .catch((err) => {
        if (!cancelled) {
          setState({ data: null, error: err.message, loading: false });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [path, tick]);

  function reload() {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    setTick((t) => t + 1);
  }

  return { ...state, reload };
}
