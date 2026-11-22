import { cn } from "@/lib/utils";

const TONES = {
  orange: "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300",
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300",
  indigo: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300",
  amber: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
  green: "bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-300",
  red: "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300",
};

export default function StatsCard({ label, value, icon: Icon, tone = "orange" }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-xl",
          TONES[tone]
        )}
      >
        <Icon className="size-6" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="truncate text-2xl font-extrabold">{value}</p>
      </div>
    </div>
  );
}