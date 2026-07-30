"use client";

import { useState } from "react";
import { Mail, Phone, X } from "lucide-react";
import type { ApiBooking } from "@/lib/api/types";
import { updateAgencyBookingStatus } from "@/lib/api/agency";
import { formatINR } from "@/lib/utils";
import { AgencyBookingStatusBadge, PaymentStatusBadge } from "./status-badge";
import { cn } from "@/lib/utils";

const STATUS_ACTIONS: { value: "confirmed" | "completed" | "cancelled"; label: string; tone: string }[] = [
  { value: "confirmed", label: "Confirm", tone: "bg-teal text-white hover:opacity-90" },
  { value: "completed", label: "Mark completed", tone: "bg-ink text-white hover:bg-teal" },
  { value: "cancelled", label: "Cancel", tone: "border border-danger text-danger hover:bg-danger/5" },
];

export default function LiveBookingDetailDrawer({
  booking,
  onClose,
  onUpdate,
}: {
  booking: ApiBooking;
  onClose: () => void;
  onUpdate: (booking: ApiBooking) => void;
}) {
  const [note, setNote] = useState(booking.agency_notes ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setStatus = async (status: "confirmed" | "completed" | "cancelled") => {
    setBusy(true);
    setError(null);
    try {
      const updated = await updateAgencyBookingStatus(booking.id, status);
      onUpdate(updated);
    } catch {
      setError("Couldn't update the status — check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  const saveNote = async () => {
    setBusy(true);
    setError(null);
    try {
      const updated = await updateAgencyBookingStatus(booking.id, booking.status as "confirmed" | "completed" | "cancelled", {
        agency_notes: note,
      });
      onUpdate(updated);
    } catch {
      setError("Couldn't save the note — check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex justify-end">
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} />
      <div className="relative h-full w-full max-w-md overflow-y-auto bg-white p-6">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate hover:text-ink" aria-label="Close">
          <X size={20} />
        </button>

        <span className="font-mono text-[11px] text-slate">{booking.booking_number}</span>
        <h2 className="mt-1 font-display text-lg font-semibold text-ink">{booking.tour?.title ?? "Tour"}</h2>
        <div className="mt-2 flex gap-2">
          <AgencyBookingStatusBadge status={booking.status} />
          <PaymentStatusBadge status={booking.payment_status} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-[11px] text-slate">Travel date</span><p className="text-ink">{booking.travel_date}</p></div>
          <div><span className="text-[11px] text-slate">Travellers</span><p className="text-ink">{booking.adults + booking.children}</p></div>
          <div className="col-span-2"><span className="text-[11px] text-slate">Amount</span><p className="font-mono text-ink">{formatINR(booking.total_amount)}</p></div>
        </div>

        <h3 className="mt-6 font-display text-[14px] font-semibold text-ink">Customer details</h3>
        <div className="mt-2 flex flex-col gap-2 text-sm text-ink/80">
          <span className="font-medium text-ink">{booking.customer_name}</span>
          <span className="inline-flex items-center gap-2"><Mail size={13} className="text-teal" /> {booking.customer_email}</span>
          <span className="inline-flex items-center gap-2"><Phone size={13} className="text-teal" /> {booking.customer_phone}</span>
          {booking.customer_city && <span className="text-ink/70">{booking.customer_city}</span>}
        </div>

        {booking.special_request && (
          <div className="mt-4 rounded-xl bg-paper-soft p-3.5 text-[13px] text-ink/80">
            <span className="block text-[11px] font-medium text-slate">Special request</span>
            {booking.special_request}
          </div>
        )}

        {booking.status === "cancelled" && booking.cancelled_reason && (
          <div className="mt-4 rounded-xl bg-danger/5 p-3.5 text-[13px] text-danger">
            <span className="block text-[11px] font-medium">Cancellation reason</span>
            {booking.cancelled_reason}
          </div>
        )}

        <h3 className="mt-6 font-display text-[14px] font-semibold text-ink">Update status</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {STATUS_ACTIONS.filter((a) => a.value !== booking.status).map((a) => (
            <button
              key={a.value}
              disabled={busy}
              onClick={() => setStatus(a.value)}
              className={cn("rounded-full px-4 py-2 text-[12.5px] font-medium disabled:opacity-50", a.tone)}
            >
              {a.label}
            </button>
          ))}
        </div>

        <h3 className="mt-6 font-display text-[14px] font-semibold text-ink">Internal note</h3>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Only your team sees this"
          className="mt-2 w-full resize-none rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink"
        />
        <button disabled={busy} onClick={saveNote} className="mt-2 w-full rounded-xl bg-ink py-2.5 text-sm font-medium text-white hover:bg-teal disabled:opacity-50">
          Save note
        </button>

        {error && <p className="mt-3 text-[12.5px] text-danger">{error}</p>}
      </div>
    </div>
  );
}
