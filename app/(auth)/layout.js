import Link from "next/link";
import { ArrowLeft, ShieldCheck, Wallet, Wrench } from "lucide-react";

import Logo from "@/components/logo";
import ThemeToggle from "@/components/theme-toggle";

const POINTS = [
  { icon: ShieldCheck, text: "Every service is approved by our admin team" },
  { icon: Wrench, text: "Track your repair from Requested to Completed" },
  { icon: Wallet, text: "Pay only after the job is done" },
];

export default function AuthLayout({ children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: branding (desktop only) */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-navy p-10 text-navy-foreground lg:flex">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <Logo className="relative text-white" />

        <div className="relative">
          <h2 className="text-3xl font-bold leading-tight text-white">
            Repairs made simple, trackable and safe.
          </h2>
          <ul className="mt-8 space-y-5">
            {POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-4 text-white/80">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-white/60">© 2026 FixMate</p>
      </aside>

      {/* Right: form */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-6">
          <div className="flex items-center gap-4">
            <Logo className="lg:hidden" />
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
          </div>
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center px-4 pb-10 sm:px-6">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}