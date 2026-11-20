import Link from "next/link";
import { Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Logo({ className }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Wrench className="h-5 w-5" />
      </span>
      <span className="text-xl font-extrabold tracking-tight">
        Fix<span className="text-primary">Mate</span>
      </span>
    </Link>
  );
}