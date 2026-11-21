"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SERVICE_CATEGORIES,
  SERVICE_MODES,
  SORT_OPTIONS,
} from "@/lib/service-options";

const ALL = "all";

export default function ServicesFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hasFilters = ["search", "category", "mode", "sort"].some((key) =>
    searchParams.get(key)
  );

  function update(changes) {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(changes).forEach(([key, value]) => {
      if (!value || value === ALL) next.delete(key);
      else next.set(key, value);
    });
    next.delete("page"); // filter bodlale abar page 1 theke
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function handleSearch(e) {
    e.preventDefault();
    const value = new FormData(e.currentTarget).get("search");
    update({ search: String(value || "").trim() });
  }

  return (
    <div className="grid gap-3 rounded-2xl border bg-card p-4 shadow-sm lg:grid-cols-[1fr_200px_180px_200px_auto]">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            key={searchParams.get("search") ?? ""}
            name="search"
            defaultValue={searchParams.get("search") ?? ""}
            placeholder="Search services..."
            className="pl-9"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      <Select
        value={searchParams.get("category") ?? ALL}
        onValueChange={(value) => update({ category: value })}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All Categories</SelectItem>
          {SERVICE_CATEGORIES.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("mode") ?? ALL}
        onValueChange={(value) => update({ mode: value })}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Service mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All Modes</SelectItem>
          {SERVICE_MODES.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("sort") ?? "newest"}
        onValueChange={(value) => update({ sort: value })}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" onClick={() => router.push(pathname)}>
          <X className="size-4" /> Clear
        </Button>
      )}
    </div>
  );
}