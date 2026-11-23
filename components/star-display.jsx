import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

// Shudhu dekhanor jonno star (click kora jay na)
export default function StarDisplay({ value = 0, size = "size-4", className }) {
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      aria-label={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(
            size,
            n <= Math.round(value)
              ? "fill-primary text-primary"
              : "text-muted-foreground/40"
          )}
        />
      ))}
    </span>
  );
}