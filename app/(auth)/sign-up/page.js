import { Suspense } from "react";
import SignUpForm from "@/components/auth/sign-up-form";

export const metadata = { title: "Sign Up" };

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <SignUpForm />
    </Suspense>
  );
}