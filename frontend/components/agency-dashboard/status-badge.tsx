import { cn } from "@/lib/utils";
import type { AgencyBookingStatus, PaymentStatus } from "@/lib/agency-dashboard-data";

const STATUS_STYLES: Record<AgencyBookingStatus, string> = {
  new: "bg-danger/10 text-danger",
  pending: "bg-gold-pale text-gold-deep",
  confirmed: "bg-teal-soft text-teal",
  completed: "bg-paper-dim text-ink/70",
  cancelled: "bg-paper-dim text-slate",
};

const STATUS_LABELS: Record<AgencyBookingStatus, string> = {
  new: "New",
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function AgencyBookingStatusBadge({ status, className }: { status: AgencyBookingStatus; className?: string }) {
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
