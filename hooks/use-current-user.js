"use client";

import { authClient } from "@/lib/auth-client";

export function useCurrentUser() {
  const { data, isPending } = authClient.useSession();

  async function signOut() {
    try {
      await authClient.signOut();
    } finally {
      // hard redirect: client state ar cache sob clear hoye jabe
      window.location.href = "/";
    }
  }

  return {
    user: data?.user ?? null,
    isPending,
    signOut,
  };
}