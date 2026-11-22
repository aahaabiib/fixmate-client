import PageHeader from "@/components/dashboard/page-header";
import AdminTransactions from "@/components/dashboard/admin/admin-transactions";

export const instant = false;

export const metadata = { title: "Transactions | FixMate" };

export default function AdminTransactionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="All payments received through the platform."
      />
      <AdminTransactions />
    </div>
  );
}