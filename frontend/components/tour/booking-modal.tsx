"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, WifiOff, X } from "lucide-react";
import type { Tour } from "@/types";
import type { ApiTourDetail } from "@/lib/api/types";
import { createBooking } from "@/lib/api/bookings";
import { ApiError, isNetworkError } from "@/lib/api/client";
import { formatINR } from "@/lib/utils";
import PayNowButton from "@/components/payment/pay-now-button";

function randomBookingId() {
  return `VYG-${Math.floor(100000 + Math.random() * 900000)}`;
}

interface Result {
  bookingNumber: string;
  bookingId?: number;
  isReal: boolean;
  fallbackNote?: string;
}

export default function BookingModal({
  tour,
  mode,
  onClose,
  source = "demo",
  apiTourDates,
}: {
  tour: Tour;
  mode: "book" | "enquire";
  onClose: () => void;
  source?: "live" | "demo";
  apiTourDates?: ApiTourDetail["tour_dates"];
}) {
  const [result, setResult] = useState<Result | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedDate, setSelectedDate] = useState(
    source === "live" && apiTourDates?.length ? String(apiTourDates[0].id) : tour.nextDepartures[0] ?? ""
  );

  const canBookLive = mode === "book" && source === "live" && !!apiTourDates?.length;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "");
    const phone = String(form.get("phone") ?? "");
    const email = String(form.get("email") ?? "");
    const city = String(form.get("city") ?? "");
    const specialRequest = String(form.get("specialRequest") ?? "");

    if (!canBookLive) {
      // Demo tour, or an enquiry (which the backend doesn't have a dedicated
      // endpoint for yet) — keep the original mock-confirmation behaviour.
      setResult({ bookingNumber: randomBookingId(), isReal: false });
      return;
    }

    setSubmitting(true);
    try {
      const booking = await createBooking(tour.slug, {
        tour_date_id: Number(selectedDate),
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        customer_city: city,
        adults,
        children,
        special_request: specialRequest || undefined,
      });
      setResult({ bookingNumber: booking.booking_number, bookingId: booking.id, isReal: true });
    } catch (err) {
      // Booking creation genuinely failed — don't pretend it succeeded, but
      // don't dead-end the demo either. Show a mock ID with an honest note.
      const note =
        err instanceof ApiError && isNetworkError(err)
          ? "Couldn't reach the Voyagr API, so this wasn't actually saved."
          : err instanceof ApiError
            ? `The backend rejected this booking: ${err.message}`
            : "Something went wrong, so this wasn't actually saved.";
      setResult({ bookingNumber: randomBookingId(), isReal: false, fallbackNote: note });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} />
      <div className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-[var(--radius-lg)] bg-white p-6 sm:rounded-[var(--radius-lg)]">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate hover:text-ink" aria-label="Close">
          <X size={20} />
        </button>

        {result ? (
          <div className="flex flex-col items-center py-6 text-center">
            <CheckCircle2 size={44} className="text-teal" />
            <h3 className="mt-4 font-display text-xl font-semibold text-ink">
              {mode === "book" ? "Booking request received" : "Enquiry sent"}
            </h3>
            <p className="mt-2 text-sm text-slate">
              {result.isReal
                ? "Your booking is Pending confirmation from the agency. Check My Bookings for updates."
                : mode === "book"
                  ? "Your booking is Pending confirmation from the agency. We've emailed the details to you, the agency and our support team."
                  : "The agency will get back to you shortly. We've sent a copy of your enquiry to your email."}
            </p>
            {result.fallbackNote && (
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-gold/30 bg-gold-pale p-3 text-left text-[12.5px] text-gold-deep">
                {result.fallbackNote.startsWith("Couldn't reach") ? (
                  <WifiOff size={14} className="mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle size={14} className="mt-0.5 shrink-0" />
                )}
                <span>{result.fallbackNote}</span>
              </div>
            )}
            <div className="mt-4 rounded-xl bg-paper-soft px-4 py-3 font-mono text-sm text-ink">
              Booking ID: <span className="font-semibold">{result.bookingNumber}</span>
            </div>

            {result.isReal && result.bookingId && (
              <div className="mt-4 w-full">
                <p className="mb-2 text-[12.5px] text-slate">Pay now to secure your seats faster, or pay later from My Bookings.</p>
                <PayNowButton bookingId={result.bookingId} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-ink hover:bg-gold-deep" />
              </div>
            )}

            <button onClick={onClose} className="mt-6 w-full rounded-full bg-ink py-3 text-sm font-medium text-white">
              Done
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-display text-xl font-semibold text-ink">
              {mode === "book" ? "Complete your booking" : "Send an enquiry"}
            </h3>
            <p className="mt-1 text-sm text-slate">{tour.title}</p>
            {mode === "book" && source === "demo" && (
              <p className="mt-2 text-[12px] text-gold-deep">
                This tour is showing demo data, so submitting here won&apos;t create a real booking.
              </p>
            )}

            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <input name="name" required placeholder="Full name" className="rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink" />
                <input name="phone" required type="tel" placeholder="Mobile number" className="rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink" />
              </div>
              <input name="email" required type="email" placeholder="Email address" className="rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink" />
              <input name="city" required placeholder="City" className="rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink" />

              {mode === "book" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex flex-col gap-1 text-xs font-medium text-slate">
                      Adults
                      <div className="flex items-center justify-between rounded-xl border border-line px-3 py-2">
                        <button type="button" onClick={() => setAdults((v) => Math.max(1, v - 1))} className="text-ink">−</button>
                        <span className="text-sm text-ink">{adults}</span>
                        <button type="button" onClick={() => setAdults((v) => v + 1)} className="text-ink">+</button>
                      </div>
                    </label>
                    <label className="flex flex-col gap-1 text-xs font-medium text-slate">
                      Children
                      <div className="flex items-center justify-between rounded-xl border border-line px-3 py-2">
                        <button type="button" onClick={() => setChildren((v) => Math.max(0, v - 1))} className="text-ink">−</button>
                        <span className="text-sm text-ink">{children}</span>
                        <button type="button" onClick={() => setChildren((v) => v + 1)} className="text-ink">+</button>
                      </div>
                    </label>
                  </div>
                  <select
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-ink"
                  >
                    {canBookLive
                      ? apiTourDates!.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.departure_date} · {d.seats_available} seats left
                          </option>
                        ))
                      : tour.nextDepartures.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </>
              )}

              <textarea name="specialRequest" placeholder="Special request (optional)" rows={3} className="resize-none rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink" />

              {mode === "book" && (
                <div className="flex items-center justify-between rounded-xl bg-paper-soft px-4 py-3 text-sm">
                  <span className="text-slate">Estimated total ({adults + children} traveller{adults + children > 1 ? "s" : ""})</span>
                  <span className="font-mono font-semibold text-ink">{formatINR(tour.price * (adults + children))}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-1 w-full rounded-full bg-gold py-3 text-sm font-semibold text-ink hover:bg-gold-deep disabled:opacity-60"
              >
                {submitting ? "Submitting..." : mode === "book" ? "Submit booking" : "Send enquiry"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
