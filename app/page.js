import Logo from "@/components/logo";
import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="min-h-screen p-10 space-y-6">
      <div className="bg-navy text-navy-foreground rounded-xl p-8">
        <div className="flex items-center justify-between">
          <Logo />
          <ThemeToggle className="hover:bg-white/10 hover:text-white" />
        </div>
        <h1 className="mt-6 text-3xl font-bold">FixMate Theme Test</h1>
        <p className="mt-2 opacity-80">Navy background with orange accents</p>
        <Button className="mt-4">Primary Button</Button>
      </div>
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>Sample Card</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Badge>Badge</Badge>
          <Button variant="outline">Outline</Button>
        </CardContent>
      </Card>
    </main>
  );
}