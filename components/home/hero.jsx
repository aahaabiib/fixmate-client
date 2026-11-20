import Link from "next/link";
import { BadgeCheck, Check, Search, ShieldCheck, Wallet, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/lib/constants";

const TRUST_POINTS = [
  { icon: ShieldCheck, label: "Verified technicians" },
  { icon: Wrench, label: "Track every step" },
  { icon: Wallet, label: "Pay after completion" },
];

const TRACK_STEPS = [
  { label: "Requested", state: "done" },
  { label: "Accepted", state: "done" },
  { label: "In Progress", state: "current" },
  { label: "Completed", state: "upcoming" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy text-navy-foreground">
      {/* soft glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
        {/* Left */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
            <BadgeCheck className="h-4 w-4 text-primary" />
            Trusted repair platform
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            Broken Device? Get It Fixed by{" "}
            <span className="text-primary">Verified Technicians</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            From smartphones to air conditioners, find a trusted technician,
            track your repair step by step and pay only after the job is done.
          </p>

          {/* Search (plain GET form, goes to /services?search=...) */}
          <form
            action="/services"
            method="GET"
            className="mt-8 flex max-w-xl flex-col gap-2 rounded-xl bg-white p-2 shadow-xl sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                name="search"
                placeholder="Try: iPhone screen, AC servicing..."
                aria-label="Search repair services"
                className="h-11 border-0 bg-transparent pl-9 text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:ring-0 dark:bg-transparent"
              />
            </div>
            <Button type="submit" size="lg" className="h-11 px-6">
              Find a Technician
            </Button>
          </form>

          {/* Quick categories */}
          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-white/60">Popular:</span>
            {CATEGORIES.slice(0, 4).map((category) => (
              <Link
                key={category}
                href={`/services?category=${encodeURIComponent(category)}`}
                className="rounded-full border border-white/15 px-3 py-1 text-white/80 transition-colors hover:border-primary hover:text-primary"
              >
                {category}
              </Link>
            ))}
          </div>

          {/* Trust points */}
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/80">
            {TRUST_POINTS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: repair tracker illustration */}
        <div className="hidden justify-center lg:flex">
          <div className="relative w-full max-w-md">
            <div className="rounded-2xl bg-card p-6 text-card-foreground shadow-2xl">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Wrench className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold">iPhone Screen Replacement</p>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <BadgeCheck className="h-4 w-4 text-blue-500" />
                    Rahim Uddin, Verified Technician
                  </p>
                </div>
              </div>

              <ul className="mt-6 space-y-4">
                {TRACK_STEPS.map((step) => (
                  <li key={step.label} className="flex items-center gap-3">
                    <span
                      className={
                        step.state === "done"
                          ? "flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-white"
                          : step.state === "current"
                          ? "flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-white"
                          : "flex h-7 w-7 items-center justify-center rounded-full border-2 border-border text-transparent"
                      }
                    >
                      <Check className="h-4 w-4" />
                    </span>
                    <span
                      className={
                        step.state === "upcoming"
                          ? "text-sm text-muted-foreground"
                          : "text-sm font-medium"
                      }
                    >
                      {step.label}
                    </span>
                    {step.state === "current" && (
                      <span className="ml-auto rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                        Working now
                      </span>
                    )}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-center justify-between rounded-lg bg-muted px-4 py-3">
                <span className="text-sm text-muted-foreground">Pay after completion</span>
                <span className="text-lg font-bold">$45</span>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg">
              <ShieldCheck className="h-5 w-5" />
              Secure Stripe payment
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}