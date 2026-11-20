import { BadgeCheck, CheckCircle2, ListChecks, ShieldCheck, Star, Users, Wallet } from "lucide-react";
import SectionHeading from "@/components/section-heading";

const POINTS = [
  {
    icon: ShieldCheck,
    title: "Verified technicians",
    text: "Every service is reviewed and approved by our admin team before it goes live.",
  },
  {
    icon: ListChecks,
    title: "Trackable jobs",
    text: "See your job move from Requested to Completed, no more calling to ask.",
  },
  {
    icon: Wallet,
    title: "Pay after service",
    text: "You pay only when the technician marks the job completed.",
  },
  {
    icon: BadgeCheck,
    title: "Clear pricing",
    text: "See the starting price upfront and the final amount before you pay.",
  },
];

const STATS = [
  { icon: Users, value: "500+", label: "Verified Technicians" },
  { icon: CheckCircle2, value: "12,000+", label: "Jobs Completed" },
  { icon: Wallet, value: "100%", label: "Pay After Service" },
  { icon: Star, value: "4.8/5", label: "Average Rating" },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-navy py-16 text-navy-foreground sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <SectionHeading
            align="left"
            inverted
            className="mb-8"
            eyebrow="Why FixMate"
            title="Repair with confidence"
            description="We built FixMate so customers stop worrying and good technicians get steady work."
          />
          <ul className="space-y-5">
            {POINTS.map((point) => (
              <li key={point.title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <point.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-white">{point.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/70">
                    {point.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/10 bg-white/5 p-6"
            >
              <stat.icon className="h-6 w-6 text-primary" />
              <p className="mt-4 text-3xl font-extrabold text-white">{stat.value}</p>
              <p className="mt-1 text-sm text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}