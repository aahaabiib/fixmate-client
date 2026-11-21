import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function buildHref(filters, page) {
  const qs = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value && key !== "page") qs.set(key, value);
  });
  if (page > 1) qs.set("page", String(page));
  const str = qs.toString();
  return str ? `/services?${str}` : "/services";
}

function getPages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const list = [
    ...new Set([1, total, current - 1, current, current + 1]),
  ]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const out = [];
  list.forEach((p, i) => {
    if (i > 0 && p - list[i - 1] > 1) out.push(`gap-${p}`);
    out.push(p);
  });
  return out;
}

export default function Pagination({ page, totalPages, filters }) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      {page > 1 ? (
        <Button asChild variant="outline" size="sm">
          <Link href={buildHref(filters, page - 1)}>
            <ChevronLeft className="size-4" /> Previous
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          <ChevronLeft className="size-4" /> Previous
        </Button>
      )}

      {getPages(page, totalPages).map((p) =>
        typeof p === "string" ? (
          <span key={p} className="px-1 text-muted-foreground">
            …
          </span>
        ) : (
          <Button
            key={p}
            asChild
            size="sm"
            variant={p === page ? "default" : "outline"}
          >
            <Link href={buildHref(filters, p)}>{p}</Link>
          </Button>
        )
      )}

      {page < totalPages ? (
        <Button asChild variant="outline" size="sm">
          <Link href={buildHref(filters, page + 1)}>
            Next <ChevronRight className="size-4" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          Next <ChevronRight className="size-4" />
        </Button>
      )}
    </nav>
  );
}