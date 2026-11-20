import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";

import SectionHeading from "@/components/section-heading";
import { CATEGORY_ICONS } from "@/lib/category-icons";
import { CATEGORIES } from "@/lib/constants";

export default function Categories() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Categories"
          title="Popular repair categories"
          description="Pick what needs fixing and see verified technicians who handle it."
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category];
            return (
              <Link
                key={category}
                href={`/services?category=${encodeURIComponent(category)}`}
                className="group flex flex-col items-center rounded-xl border bg-card p-6 text-center text-card-foreground shadow-sm transition-all hover:-translate-y-1 hover:border-primary hover:shadow-md"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="mt-4 font-semibold">{category}</h3>
                <span className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  Explore <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            );
          })}

          {/* 8th card: view all */}
          <Link
            href="/services"
            className="flex flex-col items-center justify-center rounded-xl bg-navy p-6 text-center text-navy-foreground shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <LayoutGrid className="h-7 w-7" />
            </span>
            <h3 className="mt-4 font-semibold text-white">All Services</h3>
            <span className="mt-1 flex items-center gap-1 text-sm text-white/70">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}