"use client";

import { CreditCard, DollarSign } from "lucide-react";
import { formatDate, formatMoney } from "@/lib/format";
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

export default function AdminTransactions() {
  const { data, error, loading, reload } = useApiData("/api/admin/payments");

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-28 w-full rounded-2xl sm:w-72" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={CreditCard}
        title="Could not load transactions"
        description={typeof error === "string" ? error : error?.message}
      >
        <Button onClick={reload}>Try again</Button>
      </EmptyState>
    );
  }

  const payments = data?.payments ?? [];
  const totalRevenue = data?.totalRevenue ?? 0;

  return (
    <>
      <div className="mb-6 flex items-center gap-4 rounded-2xl border bg-card p-5 sm:w-fit sm:min-w-72">
        <span className="flex size-12 items-center justify-center rounded-xl bg-green-500/15 text-green-600 dark:text-green-400">
          <DollarSign className="size-6" />
        </span>
        <div>
          <p className="text-sm text-muted-foreground">Total revenue</p>
          <p className="text-2xl font-bold">{formatMoney(totalRevenue)}</p>
          <p className="text-xs text-muted-foreground">
            From {payments.length} payment{payments.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {payments.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No transactions yet"
          description="Paid jobs will appear here once customers complete payment."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">Technician</TableHead>
                <TableHead className="hidden lg:table-cell">Transaction ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden sm:table-cell">Paid at</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p._id}>
                  <TableCell className="max-w-[180px] truncate font-medium">
                    {p.serviceTitle}
                  </TableCell>
                  <TableCell>
                    <p className="max-w-[160px] truncate">{p.customerName}</p>
                    <p className="max-w-[160px] truncate text-xs text-muted-foreground">
                      {p.customerEmail}
                    </p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <p className="max-w-[160px] truncate">{p.technicianName}</p>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                      {p.transactionId ? `${p.transactionId.slice(0, 18)}...` : "-"}
                    </code>
                  </TableCell>
                  <TableCell className="font-semibold text-green-600 dark:text-green-400">
                    {formatMoney(p.amount)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {p.paidAt ? formatDate(p.paidAt) : "-"}
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