import { cn } from "@/lib/utils";
import { STATUS_META } from "@/lib/status";

export default function StatusBadge({ status, className }) {
  const meta = STATUS_META[status] || {
    label: status,
    badge: "bg-muted text-muted-foreground",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold",
        meta.badge,
        className
      )}
    >
      {meta.label}
    </span>
  );
}