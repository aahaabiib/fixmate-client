import Link from "next/link";
import {
  BadgeCheck,
  CalendarDays,
  CreditCard,
  Loader2,
  MapPin,
  UserRound,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/status-badge";
import ServiceImage from "@/components/services/service-image";
import { formatDate, formatMoney } from "@/lib/format";

export default function BookingCard({ booking, onCancel, onPay, paying }) {
  const canCancel = booking.status === "requested";
  const canPay =
    booking.status === "completed" && booking.paymentStatus === "unpaid";
  const isPaid = booking.paymentStatus === "paid";

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm sm:flex-row">
      <div className="aspect-[16/10] w-full shrink-0 bg-muted sm:aspect-auto sm:w-52">
        <ServiceImage
          src={booking.serviceImage}
          alt={booking.serviceTitle}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              {booking.category}
            </p>
            <h3 className="line-clamp-1 text-lg font-bold">
              {booking.serviceTitle}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={booking.status} />
            {isPaid && <StatusBadge status="paid" />}
          </div>
        </div>

        <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <li className="flex items-center gap-2">
            <UserRound className="size-4 shrink-0 text-primary" />
            <span className="truncate">{booking.technicianName}</span>
          </li>
          <li className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0 text-primary" />
            Preferred: {booking.preferredDate}
          </li>
          <li className="flex items-center gap-2 sm:col-span-2">
            <MapPin className="size-4 shrink-0 text-primary" />
            <span className="line-clamp-1">{booking.address}</span>
          </li>
        </ul>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <div>
            <p className="text-xs text-muted-foreground">
              {booking.status === "completed" ? "Final amount" : "Starts at"} ·
              Requested {formatDate(booking.createdAt)}
            </p>
            <p className="text-xl font-extrabold text-primary">
              {formatMoney(
                booking.status === "completed"
                  ? booking.finalAmount
                  : booking.basePrice
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isPaid && (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 dark:text-green-400">
                <BadgeCheck className="size-4" /> Payment done
              </span>
            )}
            {canCancel && (
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => onCancel(booking)}
              >
                <XCircle className="size-4" /> Cancel
              </Button>
            )}
            {canPay && (
              <Button
                size="sm"
                disabled={paying}
                onClick={() => onPay(booking)}
              >
                {paying ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <CreditCard className="size-4" />
                )}
                Pay Now
              </Button>
            )}
            <Button asChild variant="ghost" size="sm">
              <Link href={`/services/${booking.serviceId}`}>View Service</Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}