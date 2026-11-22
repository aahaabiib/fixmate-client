"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ROOTS = [
  "/dashboard/customer",
  "/dashboard/technician",
  "/dashboard/admin",
];

// Overview shudhu exact match-e active, baki gulo sub-page-eo active
function isActive(pathname, href) {
  if (ROOTS.includes(href)) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SidebarNav({ items, collapsed = false, onNavigate }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
      {items.map(({ label, href, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            title={collapsed ? label : undefined}
            aria-current={active ? "page" : undefined}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              collapsed && "justify-center px-0",
              active
                ? "bg-primary text-primary-foreground shadow"
                : "text-navy-foreground/70 hover:bg-white/10 hover:text-navy-foreground"
            )}
          >
            <Icon className="size-5 shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}