"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorView({
  error,
  reset,
  homeHref = "/",
  homeLabel = "Back to Home",
  fullScreen = false,
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className={`flex flex-col items-center justify-center px-4 py-16 text-center ${
        fullScreen ? "min-h-screen" : "min-h-[60vh]"
      }`}
    >
      <span className="flex size-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
        <AlertTriangle className="size-8" />
      </span>
      <h1 className="mt-5 text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        An unexpected error happened. You can try again, or go back and continue from there.
      </p>
      {error?.digest && (
        <p className="mt-3 text-xs text-muted-foreground">Error ID: {error.digest}</p>
      )}

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Button onClick={() => reset()} className="bg-orange-500 text-white hover:bg-orange-600">
          <RotateCcw className="mr-2 size-4" /> Try again
        </Button>
        <Button asChild variant="outline">
          <Link href={homeHref}>
            <Home className="mr-2 size-4" /> {homeLabel}
          </Link>
        </Button>
      </div>
    </div>
  );
}