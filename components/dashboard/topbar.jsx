"use client";

import Link from "next/link";
import {
  Home,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  UserRoundCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "@/components/theme-toggle";
import UserAvatar from "@/components/user-avatar";
import { ROLE_LABEL } from "@/lib/constants";

export default function Topbar({
  user,
  collapsed,
  onToggleCollapse,
  onOpenMobile,
  onSignOut,
}) {
  const roleLabel = ROLE_LABEL[user.role] || user.role;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b bg-background/90 px-4 backdrop-blur sm:px-6">
      {/* Mobile: menu kholar button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onOpenMobile}
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </Button>

      {/* Desktop: sidebar collapse button */}
      <Button
        variant="ghost"
        size="icon"
        className="hidden lg:inline-flex"
        onClick={onToggleCollapse}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <PanelLeftOpen className="size-5" />
        ) : (
          <PanelLeftClose className="size-5" />
        )}
      </Button>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">
            <Home className="size-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </Button>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="ml-1 flex items-center gap-3 rounded-full py-1 pl-1 pr-1 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring md:pr-4"
            >
              <UserAvatar user={user} />
              <span className="hidden text-left leading-tight md:block">
                <span className="block max-w-[140px] truncate text-sm font-semibold">
                  {user.name}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {roleLabel}
                </span>
              </span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="truncate font-semibold">{user.name}</p>
              <p className="truncate text-xs font-normal text-muted-foreground">
                {user.email}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">
                <UserRoundCog className="size-4" /> Update Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onSignOut}>
              <LogOut className="size-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}