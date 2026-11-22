"use client";

import Link from "next/link";
import { CreditCard, DollarSign, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/empty-state";
import StatusBadge from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApiData } from "@/hooks/use-api-data";
import { formatDate, formatMoney } from "@/lib/format";
import ErrorState from "../error-state";
import StatsCard from "../stats-card";

export default function PaymentHistory() {
  const { data, error, loading, reload } = useApiData("/api/payments/my");

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 max-w-sm rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const { payments, totalPaid } = data;

  if (payments.length === 0) {
    return (
      <EmptyState
        icon={CreditCard}
        title="No payments yet"
        description="Once a technician completes your job, you can pay securely from My Bookings."
      >
        <Button asChild>
          <Link href="/dashboard/customer/bookings">Go to My Bookings</Link>
        </Button>
      </EmptyState>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard label="Total Paid" value={formatMoney(totalPaid)} icon={DollarSign} tone="green" />
        <StatsCard label="Payments" value={payments.length} icon={Receipt} tone="blue" />
      </div>

      <div className="rounded-2xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((p) => (
              <TableRow key={p._id}>
                <TableCell className="max-w-[200px] truncate font-medium">
                  {p.serviceTitle}
                </TableCell>
                <TableCell>{p.technicianName}</TableCell>
                <TableCell className="font-semibold">
                  {formatMoney(p.amount)}
                </TableCell>
                <TableCell className="max-w-[180px] truncate font-mono text-xs text-muted-foreground">
                  {p.transactionId}
                </TableCell>
                <TableCell>{formatDate(p.paidAt)}</TableCell>
                <TableCell>
                  <StatusBadge status="paid" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}