"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { ROLE_LABEL } from "@/lib/constants";

export default function WelcomeBanner() {
  const { user } = useCurrentUser();
  if (!user) return null;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-navy to-navy/80 p-6 text-navy-foreground shadow-sm sm:p-8">
      <p className="text-sm text-navy-foreground/70">
        {ROLE_LABEL[user.role] || user.role} account
      </p>
      <h2 className="mt-1 text-2xl font-extrabold">
        Welcome back, <span className="text-primary">{user.name}</span>
      </h2>
      <p className="mt-2 max-w-xl text-sm text-navy-foreground/70">
               Here is what is happening with your account today.
      </p>
    </div>
  );
}