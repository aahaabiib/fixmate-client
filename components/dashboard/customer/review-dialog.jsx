"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

const LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

export default function ReviewDialog({ booking, onClose, onDone }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [saving, setSaving] = useState(false);

  const shown = hover || rating;

  async function handleSubmit() {
    if (rating < 1) {
      toast.error("Please select a star rating");
      return;
    }
    setSaving(true);
    try {
      await apiFetch(`/api/bookings/${booking._id}/review`, {
        method: "PATCH",
        body: { rating, review },
      });
      toast.success("Thank you for your review");
      onDone();
      onClose();
    } catch (err) {
      toast.error(err.message);
      setSaving(false);
    }
  }

  return (
    <Dialog open onOpenChange={(v) => !v && !saving && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate this job</DialogTitle>
          <DialogDescription>
            {booking.serviceTitle} by {booking.technicianName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <div
              className="flex items-center gap-1"
              onMouseLeave={() => setHover(0)}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n} star`}
                  onMouseEnter={() => setHover(n)}
                  onClick={() => setRating(n)}
                  className="rounded p-0.5 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <Star
                    className={cn(
                      "size-8",
                      n <= shown
                        ? "fill-primary text-primary"
                        : "text-muted-foreground/40"
                    )}
                  />
                </button>
              ))}
            </div>
            <p className="mt-1 h-5 text-sm font-medium text-primary">
              {LABELS[shown]}
            </p>
          </div>

          <div>
            <label htmlFor="review-text" className="text-sm font-medium">
              Review <span className="text-muted-foreground">(optional)</span>
            </label>
            <textarea
              id="review-text"
              value={review}
              onChange={(e) => setReview(e.target.value.slice(0, 300))}
              rows={4}
              placeholder="Tell others about the repair..."
              className="mt-1.5 w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            />
            <p className="mt-1 text-right text-xs text-muted-foreground">
              {review.length}/300
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving && <Loader2 className="size-4 animate-spin" />}
            Submit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
