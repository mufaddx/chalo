"use client";

import { useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import type { DashboardBooking } from "@/lib/dashboard-data";

export default function CancelRequestButton({ booking }: { booking: DashboardBooking }) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (booking.status === "cancelled" || booking.status === "completed") {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-full border border-danger/30 py-3 text-sm font-medium text-danger transition-colors hover:bg-danger/5"
      >
        Request cancellation
      </button>

      {open && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-sm rounded-t-[var(--radius-lg)] bg-white p-6 sm:rounded-[var(--radius-lg)]">
            <button onClick={() => setOpen(false)} className="absolute right-4 top-4 text-slate hover:text-ink" aria-label="Close">
              <X size={20} />
            </button>

            {submitted ? (
              <div className="flex flex-col items-center py-4 text-center">
                <CheckCircle2 size={40} className="text-teal" />
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">Cancellation requested</h3>
                <p className="mt-2 text-sm text-slate">
                  {booking.tour.agency.name} will review this and confirm your refund, per the cancellation policy on this booking.
                </p>
                <button onClick={() => setOpen(false)} className="mt-5 w-full rounded-full bg-ink py-3 text-sm font-medium text-white">
                  Done
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-display text-lg font-semibold text-ink">Request cancellation?</h3>
                <p className="mt-1 text-sm text-slate">Booking {booking.bookingNumber} · {booking.tour.title}</p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  className="mt-4 flex flex-col gap-3"
                >
                  <textarea
                    placeholder="Tell us why (optional)"
                    rows={3}
                    className="resize-none rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink"
                  />
                  <button type="submit" className="w-full rounded-full bg-danger py-3 text-sm font-semibold text-white hover:opacity-90">
                    Confirm cancellation request
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
