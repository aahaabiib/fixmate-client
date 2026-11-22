import {
  CalendarCheck,
  CirclePlus,
  ClipboardList,
  CreditCard,
  Inbox,
  LayoutDashboard,
  Receipt,
  ShieldCheck,
  UserRoundCog,
  Users,
  Wrench,
} from "lucide-react";

const PROFILE = {
  label: "Profile",
  href: "/dashboard/profile",
  icon: UserRoundCog,
};

export const DASHBOARD_NAV = {
  customer: [
    { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    { label: "My Bookings", href: "/dashboard/customer/bookings", icon: ClipboardList },
    { label: "Payment History", href: "/dashboard/customer/payments", icon: CreditCard },
    PROFILE,
  ],
  technician: [
    { label: "Overview", href: "/dashboard/technician", icon: LayoutDashboard },
    { label: "Add Service", href: "/dashboard/technician/add-service", icon: CirclePlus },
    { label: "My Services", href: "/dashboard/technician/my-services", icon: Wrench },
    { label: "Requests", href: "/dashboard/technician/requests", icon: Inbox },
    PROFILE,
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Services", href: "/dashboard/admin/services", icon: ShieldCheck },
    { label: "Bookings", href: "/dashboard/admin/bookings", icon: CalendarCheck },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: Receipt },
    PROFILE,
  ],
};

// "/dashboard/admin/users" -> "admin". /dashboard/profile ar /dashboard -> null (shobai pabe)
export function getRequiredRole(pathname) {
  const segment = pathname.split("/")[2];
  return ["customer", "technician", "admin"].includes(segment) ? segment : null;
}