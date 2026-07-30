"use client";

import { useState } from "react";
import { CalendarDays, MessageCircle, Phone, ShieldCheck, Users } from "lucide-react";
import type { Tour } from "@/types";
import type { ApiTourDetail } from "@/lib/api/types";
import { discountPercent, formatINR } from "@/lib/utils";
import BookingModal from "./booking-modal";

export default function BookingPanel({
  tour,
  source = "demo",
  apiTourDates,
}: {
  tour: Tour;
  source?: "live" | "demo";
  apiTourDates?: ApiTourDetail["tour_dates"];
}) {
  const [modal, setModal] = useState<"book" | "enquire" | null>(null);
  const discount = discountPercent(tour.price, tour.originalPrice);

  return (
    <div className="sticky top-24 rounded-[var(--radius-lg)] border border-line bg-white p-5 shadow-[0_20px_50px_-30px_rgba(14,20,32,0.35)]">
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-2xl font-semibold text-ink">{formatINR(tour.price)}</span>
        {discount > 0 && <span className="font-mono text-sm text-slate line-through">{formatINR(tour.originalPrice)}</span>}
      </div>
      <span className="text-xs text-slate">per person · {discount > 0 ? `${discount}% off` : "best available price"}</span>

      <div className="mt-4 flex flex-col gap-2 border-y border-line py-4">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="inline-flex items-center gap-2 text-slate"><CalendarDays size={15} /> Travel date</span>
          <select className="rounded-lg border border-line px-2.5 py-1.5 text-xs text-ink focus:outline-none">
            {tour.nextDepartures.map((d) => <option key={d}>{d}</option>)}
          </select>
        </label>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="inline-flex items-center gap-2 text-slate"><Users size={15} /> Travellers</span>
          <span className="text-xs font-medium text-ink">2 Adults</span>
        </div>
      </div>

      <p className="mt-3 text-xs text-danger">Only {tour.seatsLeft} seats left at this price</p>

      <div className="mt-3 flex flex-col gap-2">
        <button
          onClick={() => setModal("book")}
          className="w-full rounded-full bg-gold py-3 text-sm font-semibold text-ink transition-colors hover:bg-gold-deep"
        >
          Book now
        </button>
        <button
          onClick={() => setModal("enquire")}
          className="w-full rounded-full border border-line py-3 text-sm font-medium text-ink transition-colors hover:border-ink"
        >
          Send an enquiry
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <a
          href={`https://wa.me/910000000000?text=${encodeURIComponent(`Hi, I'm interested in "${tour.title}"`)}`}
          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-line py-2.5 text-xs font-medium text-ink hover:border-teal"
        >
          <MessageCircle size={14} className="text-teal" /> WhatsApp
        </a>
        <a
          href={`tel:${tour.agency.phone.replace(/\s/g, "")}`}
          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-line py-2.5 text-xs font-medium text-ink hover:border-teal"
        >
          <Phone size={14} className="text-teal" /> Call agency
        </a>
      </div>

      {tour.freeCancellation && (
        <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-teal">
          <ShieldCheck size={14} /> Free cancellation up to 48 hours before departure
        </p>
      )}

      {modal && (
        <BookingModal tour={tour} mode={modal} onClose={() => setModal(null)} source={source} apiTourDates={apiTourDates} />
      )}
    </div>
  );
}
