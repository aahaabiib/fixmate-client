import { CreditCard, Search, Send, Wrench } from "lucide-react";
import SectionHeading from "@/components/section-heading";

const STEPS = [
  {
    icon: Search,
    title: "Find a Service",
    text: "Browse approved repair services and compare price, area and technician.",
  },
  {
    icon: Send,
    title: "Send a Request",
    text: "Describe the problem, pick a date and send your repair request.",
  },
  {
    icon: Wrench,
    title: "Technician Fixes It",
    text: "Follow the job live: Accepted, In Progress and then Completed.",
  },
  {
    icon: CreditCard,
    title: "Pay After Completion",
    text: "Pay securely with Stripe only after the work is delivered.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-muted/50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How It Works"
          title="Fixed in 4 simple steps"
          description="No guessing and no advance payment. You always know what is happening with your device."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="relative rounded-xl border bg-card p-6 text-card-foreground shadow-sm"
            >
              <span className="absolute right-5 top-5 text-4xl font-extrabold text-muted-foreground/20">
                {index + 1}
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy text-primary">
                <step.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}