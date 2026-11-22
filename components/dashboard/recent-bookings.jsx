import Link from "next/link";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/status-badge";

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function RecentBookings({
  title = "Recent requests",
  bookings,
  viewAllHref,
  showCustomer = false,
}) {
  const rows = bookings.slice(0, 5);

  return (
    <div className="rounded-2xl border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b p-5">
        <h3 className="font-bold">{title}</h3>
        <Button asChild variant="ghost" size="sm">
          <Link href={viewAllHref}>View all</Link>
        </Button>
      </div>
      <ul className="divide-y">
        {rows.map((b) => (
          <li
            key={b._id}
            className="flex items-center justify-between gap-3 px-5 py-4"
          >
            <div className="min-w-0">
              <p className="truncate font-semibold">{b.serviceTitle}</p>
              <p className="truncate text-xs text-muted-foreground">
                {showCustomer ? b.customerName : b.technicianName} ·{" "}
                {formatDate(b.createdAt)}
              </p>
            </div>
            <StatusBadge status={b.status} />
          </li>
        ))}
      </ul>
    </div>
  );
}