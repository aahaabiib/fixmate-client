"use client";

import Link from "next/link";
import { Info, LogIn, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";
import RequestDialog from "./request-dialog";

export default function RequestPanel({ service }) {
  const { user, isPending } = useCurrentUser();

  if (isPending) {
    return <Skeleton className="h-11 w-full" />;
  }

  // Logged out: sign-in e pathao, login-er por ei page-e ferot
  if (!user) {
    const redirect = encodeURIComponent(`/services/${service._id}`);
    return (
      <Button asChild size="lg" className="w-full">
        <Link href={`/sign-in?redirect=${redirect}`}>
          <LogIn className="size-4" /> Sign in to request repair
        </Link>
      </Button>
    );
  }

  // Technician / Admin request pathate parbe na
  if (user.role !== "customer") {
    return (
      <div className="space-y-3">
        <Button size="lg" className="w-full" disabled>
          <Wrench className="size-4" /> Request Repair
        </Button>
        <p className="flex items-start gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0" />
          Only customers can request a repair.
        </p>
      </div>
    );
  }

  return <RequestDialog service={service} user={user} />;
}