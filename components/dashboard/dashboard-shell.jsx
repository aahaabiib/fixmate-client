"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useCurrentUser } from "@/hooks/use-current-user";
import { authClient } from "@/lib/auth-client";
import { ROLE_DASHBOARD } from "@/lib/constants";
import { DASHBOARD_NAV, getRequiredRole } from "@/lib/dashboard-nav";
import { cn } from "@/lib/utils";
import DashboardSkeleton from "./dashboard-skeleton";
import SidebarContent from "./sidebar";
import Topbar from "./topbar";

export default function DashboardShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isPending } = useCurrentUser();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const warned = useRef(false);
  const signingOut = useRef(false);

  const role = user && DASHBOARD_NAV[user.role] ? user.role : "customer";
  const needed = getRequiredRole(pathname);
  const allowed = Boolean(user) && (!needed || needed === role);

  useEffect(() => {
    // Session load hocche: kichu korbo na (reload-e login-e pathabo na)
    if (isPending || signingOut.current) return;

    if (!user) {
      router.replace(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (allowed) {
      warned.current = false;
      return;
    }

    // Wrong role: nijer dashboard-e pathai
    if (!warned.current) {
      warned.current = true;
      toast.error("You do not have access to that page");
    }
    router.replace(ROLE_DASHBOARD[role] || "/dashboard/customer");
  }, [isPending, user, allowed, pathname, role, router]);

  async function handleSignOut() {
    signingOut.current = true;
    try {
      await authClient.signOut();
      toast.success("Signed out successfully");
      router.replace("/sign-in");
    } catch {
      signingOut.current = false;
      toast.error("Could not sign out. Please try again.");
    }
  }

  // Load hocche ba redirect hocche: skeleton dekhai
  if (isPending || !allowed) return <DashboardSkeleton />;

  const items = DASHBOARD_NAV[role];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden transition-[width] duration-300 lg:block",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        <SidebarContent
          items={items}
          collapsed={collapsed}
          onSignOut={handleSignOut}
        />
      </aside>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 gap-0 border-0 p-0 lg:hidden">
          <SheetTitle className="sr-only">Dashboard menu</SheetTitle>
          <SidebarContent
            items={items}
            onNavigate={() => setMobileOpen(false)}
            onSignOut={handleSignOut}
          />
        </SheetContent>
      </Sheet>

      <div
        className={cn(
          "transition-[padding] duration-300",
          collapsed ? "lg:pl-[72px]" : "lg:pl-64"
        )}
      >
        <Topbar
          user={user}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((v) => !v)}
          onOpenMobile={() => setMobileOpen(true)}
          onSignOut={handleSignOut}
        />
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}