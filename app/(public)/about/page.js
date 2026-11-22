import Link from "next/link";
import {
  BadgeCheck,
  CreditCard,
  Home,
  ShieldCheck,
  Star,
  Store,
  Users,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About | FixMate",
  description:
    "FixMate connects customers with trusted technicians for smartphone, laptop, AC, TV and home appliance repair.",
};

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Trusted technicians",
    text: "Every service is reviewed and approved by our admin team before customers can see it.",
  },
  {
    icon: CreditCard,
    title: "Safe payments",
    text: "You pay only after the job is completed, through secure Stripe checkout.",
  },
  {
    icon: BadgeCheck,
    title: "Clear pricing",
    text: "See the base price upfront. The technician confirms the final amount when the work is done.",
  },
  {
    icon: Star,
    title: "Real progress",
    text: "Track your request from requested to completed, so you always know what is happening.",
  },
];

const STEPS = [
  { title: "Find a service", text: "Search by category, price or area and pick a technician." },
  { title: "Send a request", text: "Tell us the problem, your address and the date you prefer." },
  { title: "Get it fixed", text: "The technician accepts, does the repair and marks it completed." },
  { title: "Pay securely", text: "Pay online after the job is done and keep your payment history." },
];

const CATEGORIES = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-orange-300">
            <Wrench className="size-4" /> About FixMate
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-3xl font-extrabold leading-tight sm:text-5xl">
            Repairs made simple, for every device and home appliance
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-white/75 sm:text-lg">
            FixMate is a platform where customers book trusted technicians, and technicians
            find steady work, all in one place.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Why we built FixMate</h2>
            <p className="mt-4 text-muted-foreground">
              Finding a reliable repair person is hard. Prices are unclear, quality is a
              guess, and there is no easy way to follow up. At the same time, skilled
              technicians struggle to reach customers.
            </p>
            <p className="mt-3 text-muted-foreground">
              FixMate fixes both sides. Customers get a clear, safe way to request a repair.
              Technicians get a simple dashboard to manage services, requests and earnings.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border bg-card p-5">
              <Home className="size-6 text-orange-500" />
              <p className="mt-3 font-semibold">Home visit</p>
              <p className="mt-1 text-sm text-muted-foreground">
                The technician comes to your door.
              </p>
            </div>
            <div className="rounded-2xl border bg-card p-5">
              <Store className="size-6 text-orange-500" />
              <p className="mt-3 font-semibold">Shop drop-off</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Drop your device at the repair shop.
              </p>
            </div>
            <div className="rounded-2xl border bg-card p-5 sm:col-span-2">
              <Users className="size-6 text-orange-500" />
              <p className="mt-3 font-semibold">Three roles, one platform</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Customers, technicians and admins each get their own dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">What we stand for</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="h-full rounded-2xl border bg-card p-6">
                <span className="flex size-11 items-center justify-center rounded-xl bg-orange-500/15 text-orange-500">
                  <v.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">How it works</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.title} className="h-full rounded-2xl border bg-card p-6">
              <span className="flex size-9 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">What we repair</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                href={`/services?category=${encodeURIComponent(c)}`}
                className="rounded-full border bg-card px-5 py-2 text-sm font-medium transition hover:border-orange-500 hover:text-orange-500"
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <div className="rounded-3xl bg-navy px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-2xl font-bold sm:text-3xl">Ready to get started?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/75">
            Book a repair today, or join as a technician and grow your business.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-orange-500 text-white hover:bg-orange-600">
              <Link href="/services">Browse services</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/sign-up">Create an account</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}