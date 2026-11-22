import PageHeader from "@/components/dashboard/page-header";
import AdminUsers from "@/components/dashboard/admin/admin-users";

export const instant = false;

export const metadata = { title: "Users | FixMate" };

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Users" description="Search users and manage their roles." />
      <AdminUsers />
    </div>
  );
}