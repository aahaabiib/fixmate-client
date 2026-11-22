import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import NotFoundIllustration from "@/components/not-found-illustration";

export const metadata = { title: "Page not found | FixMate" };

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12 text-center">
      <Link href="/" className="mb-8">
        <Logo />
      </Link>

      <NotFoundIllustration className="w-full max-w-xs" />

      <h1 className="mt-6 text-2xl font-bold sm:text-3xl">This page needs repairing</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        We could not find the page you are looking for. It may have been moved, removed,
        or the link is wrong.
      </p>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Button asChild className="bg-orange-500 text-white hover:bg-orange-600">
          <Link href="/">
            <Home className="mr-2 size-4" /> Back to Home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/services">
            <Search className="mr-2 size-4" /> Browse services
          </Link>
        </Button>
      </div>
    </main>
  );
}