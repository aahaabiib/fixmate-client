"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2, UserRound, Wrench } from "lucide-react";

import PasswordInput from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentUser } from "@/hooks/use-current-user";
import { authClient } from "@/lib/auth-client";
import { ROLE_DASHBOARD } from "@/lib/constants";
import { getSafeRedirect } from "@/lib/redirect";
import { cn } from "@/lib/utils";
import { validateEmail, validateName, validatePassword } from "@/lib/validators";

const ROLE_OPTIONS = [
    {
        value: "customer",
        title: "Customer",
        text: "I want to get my device repaired",
        icon: UserRound,
    },
    {
        value: "technician",
        title: "Technician",
        text: "I repair devices and offer services",
        icon: Wrench,
    },
];

export default function SignUpForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = getSafeRedirect(searchParams.get("redirect"));
    const { user } = useCurrentUser();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "customer",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Already logged in hole dashboard e pathai
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
            name: validateName(form.name),
            email: validateEmail(form.email),
            password: validatePassword(form.password),
        };
        setErrors(newErrors);
        if (Object.values(newErrors).some(Boolean)) return;

        setLoading(true);
        try {
            const { error } = await authClient.signUp.email({
                name: form.name.trim(),
                email: form.email.trim(),
                password: form.password,
                role: form.role,
            });

            if (error) {
                toast.error(error.message || "Sign up failed. Please try again.");
                return;
            }

            toast.success("Account created! Welcome to FixMate.");
            router.push(redirectTo ?? ROLE_DASHBOARD[form.role]);
            router.refresh();
        } catch {
            toast.error("Something went wrong. Please check your connection.");
        } finally {
            setLoading(false);
        }
    }

    const signInHref = redirectTo
        ? `/sign-in?redirect=${encodeURIComponent(redirectTo)}`
        : "/sign-in";

    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
            <p className="mt-2 text-muted-foreground">
                Join FixMate as a customer or a technician.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
                {/* Role */}
                <div className="space-y-2">
                    <Label>I am a</Label>
                    <div className="grid grid-cols-2 gap-3">
                        {ROLE_OPTIONS.map(({ value, title, text, icon: Icon }) => {
                            const selected = form.role === value;
                            return (
                                <button
                                    type="button"
                                    key={value}
                                    onClick={() => updateField("role", value)}
                                    aria-pressed={selected}
                                    className={cn(
                                        "rounded-xl border-2 p-4 text-left transition-all",
                                        selected
                                            ? "border-primary bg-primary/10"
                                            : "border-border hover:border-primary/50"
                                    )}
                                >
                                    <Icon
                                        className={cn(
                                            "h-6 w-6",
                                            selected ? "text-primary" : "text-muted-foreground"
                                        )}
                                    />
                                    <p className="mt-2 font-semibold">{title}</p>
                                    <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                                        {text}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Name */}
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        value={form.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        placeholder="Your full name"
                        autoComplete="name"
                        aria-invalid={Boolean(errors.name)}
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                {/* Email */}
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

                {/* Password */}
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <PasswordInput
                        id="password"
                        value={form.password}
                        onChange={(e) => updateField("password", e.target.value)}
                        placeholder="Min 6 chars, with upper and lower case"
                        autoComplete="new-password"
                        aria-invalid={Boolean(errors.password)}
                    />
                    {errors.password && (
                        <p className="text-sm text-destructive">{errors.password}</p>
                    )}
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {loading ? "Creating account..." : "Sign Up"}
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href={signInHref} className="font-semibold text-orange-700 hover:underline dark:text-primary">
                    Sign In
                </Link>
            </p>
        </div>
    );
}