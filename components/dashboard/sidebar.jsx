"use client";

import Link from "next/link";
import { LogOut, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import SidebarNav from "./sidebar-nav";

export default function SidebarContent({
  items,
  collapsed = false,
  onNavigate,
  onSignOut,
}) {
  return (
    <div className="flex h-full flex-col bg-navy text-navy-foreground">
      <Link
        href="/"
        className={cn(
          "flex h-16 shrink-0 items-center gap-2 border-b border-white/10 px-4",
          collapsed && "justify-center px-0"
        )}
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Wrench className="size-5" />
        </span>
        {!collapsed && (
          <span className="text-xl font-extrabold">
            Fix<span className="text-primary">Mate</span>
          </span>
        )}
      </Link>

      <SidebarNav items={items} collapsed={collapsed} onNavigate={onNavigate} />

      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={onSignOut}
          title={collapsed ? "Sign Out" : undefined}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-navy-foreground/70 transition-colors hover:bg-white/10 hover:text-navy-foreground",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="size-5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
}
