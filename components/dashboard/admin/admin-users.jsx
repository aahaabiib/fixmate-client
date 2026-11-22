"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Search, Users } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { useApiData } from "@/hooks/use-api-data";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EmptyState from "@/components/empty-state";
import ConfirmDialog from "@/components/confirm-dialog";

const ROLES = ["customer", "technician", "admin"];

const ROLE_STYLE = {
  customer: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  technician: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  admin: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
};

function Avatar({ user }) {
  if (user.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={user.image} alt={user.name} className="size-9 rounded-full object-cover" />;
  }
  return (
    <span className="flex size-9 items-center justify-center rounded-full bg-orange-500/15 text-sm font-semibold text-orange-500">
      {(user.name || "?").charAt(0).toUpperCase()}
    </span>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-xl" />
      ))}
    </div>
  );
}

export default function AdminUsers() {
  const { user: me } = useCurrentUser();
  const { data, error, loading, reload } = useApiData("/api/admin/users");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [pending, setPending] = useState(null); // { user, role }
  const [saving, setSaving] = useState(false);

  const users = data?.users ?? [];

  const term = search.trim().toLowerCase();
  const visible = users.filter((u) => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (!term) return true;
    return (
      (u.name || "").toLowerCase().includes(term) ||
      (u.email || "").toLowerCase().includes(term)
    );
  });

  const isMe = (u) => u.email === me?.email;

  async function confirmRoleChange() {
    const { user: target, role } = pending;
    setSaving(true);
    try {
      await apiFetch(`/api/admin/users/${target._id}/role`, {
        method: "PATCH",
        body: { role },
      });
      toast.success(`${target.name} is now ${role}`);
      setPending(null);
      await reload();
    } catch (err) {
      toast.error(err.message || "Could not change role");
      setPending(null);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <TableSkeleton />;

  if (error) {
    return (
      <EmptyState
        icon={Users}
        title="Could not load users"
        description={typeof error === "string" ? error : error?.message}
      >
        <Button onClick={reload}>Try again</Button>
      </EmptyState>
    );
  }

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {ROLES.map((r) => (
              <SelectItem key={r} value={r} className="capitalize">
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users found"
          description="Try a different search or role filter."
        >
          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              setRoleFilter("all");
            }}
          >
            Clear filters
          </Button>
        </EmptyState>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden lg:table-cell">Joined</TableHead>
                <TableHead className="w-44">Change role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((u) => (
                <TableRow key={u._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar user={u} />
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {u.name} {isMe(u) && <span className="text-xs text-muted-foreground">(you)</span>}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{u.phone || "-"}</TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                        ROLE_STYLE[u.role] ?? ROLE_STYLE.customer
                      }`}
                    >
                      {u.role}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {u.createdAt ? formatDate(u.createdAt) : "-"}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={u.role}
                      disabled={isMe(u)}
                      onValueChange={(role) => role !== u.role && setPending({ user: u, role })}
                    >
                      <SelectTrigger className="w-full" size="sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((r) => (
                          <SelectItem key={r} value={r} className="capitalize">
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ConfirmDialog
        open={!!pending}
        onOpenChange={(open) => !open && !saving && setPending(null)}
        title="Change user role?"
        description={`${pending?.user?.name ?? "This user"} will become ${pending?.role ?? ""}. They need to sign in again to see the change.`}
        confirmLabel={saving ? "Saving..." : "Change role"}
        onConfirm={confirmRoleChange}
      />
    </>
  );
}