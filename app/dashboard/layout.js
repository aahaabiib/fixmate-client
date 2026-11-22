import { Suspense } from "react";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import DashboardSkeleton from "@/components/dashboard/dashboard-skeleton";

export const metadata = {
  title: "Dashboard | FixMate",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  );
}