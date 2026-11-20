"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import PasswordInput from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentUser } from "@/hooks/use-current-user";
import { authClient } from "@/lib/auth-client";
import { ROLE_DASHBOARD } from "@/lib/constants";
import { getSafeRedirect } from "@/lib/redirect";
import { validateEmail } from "@/lib/validators";

export default function SignInForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = getSafeRedirect(searchParams.get("redirect"));
    const { user } = useCurrentUser();

    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            router.replace(redirectTo ?? ROLE_DASHBOARD[user.role] ?? ROLE_DASHBOARD.customer);
        }
    }, [user, redirectTo, router]);

    function updateField(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const newErrors = {
            email: validateEmail(form.email),
            password: form.password ? "" : "Password is required",
        };
        setErrors(newErrors);
        if (Object.values(newErrors).some(Boolean)) return;

        setLoading(true);
        try {
            const { data, error } = await authClient.signIn.email({
                email: form.email.trim(),
                password: form.password,
            });

            if (error) {
                toast.error(error.message || "Invalid email or password");
                return;
            }

            const role = data?.user?.role ?? "customer";
            toast.success("Signed in successfully");
            router.push(redirectTo ?? ROLE_DASHBOARD[role] ?? ROLE_DASHBOARD.customer);
            router.refresh();
        } catch {
            toast.error("Something went wrong. Please check your connection.");
        } finally {
            setLoading(false);
        }
    }

    const signUpHref = redirectTo
        ? `/sign-up?redirect=${encodeURIComponent(redirectTo)}`
        : "/sign-up";

    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-muted-foreground">
                Sign in to manage your repairs and bookings.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                        aria-invalid={Boolean(errors.email)}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <PasswordInput
                        id="password"
                        value={form.password}
                        onChange={(e) => updateField("password", e.target.value)}
                        placeholder="Your password"
                        autoComplete="current-password"
                        aria-invalid={Boolean(errors.password)}
                    />
                    {errors.password && (
                        <p className="text-sm text-destructive">{errors.password}</p>
                    )}
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {loading ? "Signing in..." : "Sign In"}
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href={signUpHref} className="font-semibold text-orange-700 hover:underline dark:text-primary">
                    Sign Up
                </Link>
            </p>
        </div>
    );
}