import { cn } from "@/lib/utils";
import type { BookingStatus, PaymentStatus } from "@/lib/dashboard-data";

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending: "bg-gold-pale text-gold-deep",
  confirmed: "bg-teal-soft text-teal",
  completed: "bg-paper-dim text-ink/70",
  cancelled: "bg-danger/10 text-danger",
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function BookingStatusBadge({ status, className }: { status: BookingStatus; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold", STATUS_STYLES[status], className)}>
      {STATUS_LABELS[status]}
    </span>
  );
}

const PAYMENT_STYLES: Record<PaymentStatus, string> = {
  unpaid: "bg-danger/10 text-danger",
  partial: "bg-gold-pale text-gold-deep",
  paid: "bg-teal-soft text-teal",
  refunded: "bg-paper-dim text-ink/70",
};

export function PaymentStatusBadge({ status, className }: { status: PaymentStatus; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize", PAYMENT_STYLES[status], className)}>
      {status}
    </span>
  );
}
