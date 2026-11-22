"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ROLE_DASHBOARD } from "@/lib/constants";

export default function DashboardIndex() {
  const router = useRouter();
  const { user } = useCurrentUser();

  useEffect(() => {
    if (user) {
      router.replace(ROLE_DASHBOARD[user.role] || "/dashboard/customer");
    }
  }, [user, router]);

  return <Skeleton className="h-40 w-full rounded-2xl" />;
}