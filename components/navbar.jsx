"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { LayoutDashboard, LogOut, Menu, UserCog } from "lucide-react";

import Logo from "@/components/logo";
import ThemeToggle from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";
import { NAV_LINKS, ROLE_DASHBOARD, ROLE_LABEL } from "@/lib/constants";
import { cn } from "@/lib/utils";

function getInitials(name = "") {
    return name
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isPending, signOut } = useCurrentUser();
    const [open, setOpen] = useState(false);

    const dashboardHref = user
        ? ROLE_DASHBOARD[user.role] ?? ROLE_DASHBOARD.customer
        : "/sign-in";

    const isActive = (href) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    async function handleSignOut() {
        await signOut();
        setOpen(false);
        toast.success("Signed out successfully");
        router.push("/");
    }

    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-navy text-navy-foreground">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Logo className="text-white" />

                {/* Desktop links */}
                <nav className="hidden items-center gap-1 md:flex">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "rounded-md px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                                isActive(link.href) ? "text-primary" : "text-white/80"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right side */}
                <div className="flex items-center gap-2">
                    <ThemeToggle className="text-white hover:bg-white/10 hover:text-white" />

                    {isPending ? (
                        <Skeleton className="h-9 w-9 rounded-full bg-white/20" />
                    ) : user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className="rounded-full outline-none ring-primary focus-visible:ring-2"
                                    aria-label="Open user menu"
                                >
                                    <Avatar className="h-9 w-9 border-2 border-primary">
                                        <AvatarImage src={user.image || undefined} alt={user.name} />
                                        <AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-60">
                                <DropdownMenuLabel className="space-y-1.5">
                                    <p className="truncate text-sm font-semibold">{user.name}</p>
                                    <p className="truncate text-xs font-normal text-muted-foreground">
                                        {user.email}
                                    </p>
                                    <Badge>{ROLE_LABEL[user.role] ?? "Customer"}</Badge>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href={dashboardHref}>
                                        <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/profile">
                                        <UserCog className="mr-2 h-4 w-4" /> Update Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleSignOut}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="hidden items-center gap-2 md:flex">
                            <Button
                                asChild
                                variant="ghost"
                                className="text-white hover:bg-white/10 hover:text-white"
                            >
                                <Link href="/sign-in">Sign In</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/sign-up">Sign Up</Link>
                            </Button>
                        </div>
                    )}

                    {/* Mobile menu */}
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/10 hover:text-white md:hidden"
                                aria-label="Open menu"
                            >
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="w-72 border-white/10 bg-navy text-navy-foreground"
                        >
                            <SheetHeader>
                                <SheetTitle className="text-white">Menu</SheetTitle>
                                <SheetDescription className="sr-only">
                                    Site navigation
                                </SheetDescription>
                            </SheetHeader>

                            <nav className="flex flex-col gap-1 px-4">
                                {NAV_LINKS.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        className={cn(
                                            "rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/10",
                                            isActive(link.href) ? "text-primary" : "text-white/80"
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                ))}

                                <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
                                    {user ? (
                                        <>
                                            <Button asChild onClick={() => setOpen(false)}>
                                                <Link href={dashboardHref}>Dashboard</Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={handleSignOut}
                                                className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                                            >
                                                Sign Out
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                asChild
                                                variant="outline"
                                                onClick={() => setOpen(false)}
                                                className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                                            >
                                                <Link href="/sign-in">Sign In</Link>
                                            </Button>
                                            <Button asChild onClick={() => setOpen(false)}>
                                                <Link href="/sign-up">Sign Up</Link>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}