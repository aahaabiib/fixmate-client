"use client";

// TEMPORARY: BetterAuth setup korar por ei file ta real session diye bodle dibo.
const DEMO_USER = null;
// Logged-in UI test korte chaile upore null er jaygay ei object ta boshao:
// { name: "Habib Rahman", email: "test@example.com", role: "technician", image: "" }

export function useCurrentUser() {
  return {
    user: DEMO_USER,
    isPending: false,
    signOut: async () => {},
  };
}