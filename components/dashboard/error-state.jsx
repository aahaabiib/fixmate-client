import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed bg-card/50 px-6 py-14 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/15">
        <TriangleAlert className="size-7" />
      </div>
      <h3 className="mt-4 text-lg font-bold">Could not load data</h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        {message || "Something went wrong. Please try again."}
      </p>
      {onRetry && (
        <Button className="mt-5" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}