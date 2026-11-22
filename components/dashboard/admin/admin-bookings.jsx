"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { formatDate, formatMoney } from "@/lib/format";
import { BOOKING_STATUSES, STATUS_META } from "@/lib/status";
import { useApiData } from "@/hooks/use-api-data";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EmptyState from "@/components/empty-state";
import StatusBadge from "@/components/status-badge";

const labelOf = (s) => STATUS_META[s]?.label ?? s;

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-xl" />
      ))}
    </div>
  );
}

export default function AdminBookings() {
  const { data, error, loading, reload } = useApiData("/api/admin/bookings");
  const [filter, setFilter] = useState("all");

  const bookings = data?.bookings ?? [];

  const counts = bookings.reduce(
    (acc, b) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    },
    { all: bookings.length }
  );

  const visible = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  if (loading) return <TableSkeleton />;

  if (error) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Could not load bookings"
        description={typeof error === "string" ? error : error?.message}
      >
        <Button onClick={reload}>Try again</Button>
      </EmptyState>
    );
  }

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No bookings yet"
        description="Bookings will show up here when customers request services."
      />
    );
  }

  return (
    <>
      <div className="mb-5 flex flex-wrap gap-2">
        {["all", ...BOOKING_STATUSES].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              filter === s
                ? "border-orange-500 bg-orange-500 text-white"
                : "hover:border-orange-500 hover:text-orange-500"
            }`}
          >
            {s === "all" ? "All" : labelOf(s)} ({counts[s] || 0})
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No bookings in this status"
          description="Try another filter."
        >
          <Button variant="outline" onClick={() => setFilter("all")}>
            Show all
          </Button>
        </EmptyState>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">Technician</TableHead>
                <TableHead className="hidden lg:table-cell">Preferred date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((b) => (
                <TableRow key={b._id}>
                  <TableCell>
                    <p className="max-w-[180px] truncate font-medium">{b.serviceTitle}</p>
                    <p className="text-xs text-muted-foreground">{b.category}</p>
                  </TableCell>
                  <TableCell>
                    <p className="max-w-[160px] truncate">{b.customerName}</p>
                    <p className="max-w-[160px] truncate text-xs text-muted-foreground">
                      {b.customerEmail}
                    </p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <p className="max-w-[160px] truncate">{b.technicianName}</p>
                    <p className="max-w-[160px] truncate text-xs text-muted-foreground">
                      {b.technicianEmail}
                    </p>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {formatDate(b.preferredDate)}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatMoney(b.finalAmount ?? b.basePrice)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={b.status} />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {b.status === "completed" ? (
                      <StatusBadge status={b.paymentStatus === "paid" ? "paid" : "unpaid"} />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}