"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, MapPin, Phone, StickyNote, X } from "lucide-react";
import type { AgencyBooking, AgencyBookingStatus } from "@/lib/agency-dashboard-data";
import { formatINR } from "@/lib/utils";
import { AgencyBookingStatusBadge, PaymentStatusBadge } from "./status-badge";
import { cn } from "@/lib/utils";

const STATUS_ACTIONS: { value: AgencyBookingStatus; label: string; tone: string }[] = [
  { value: "confirmed", label: "Confirm", tone: "bg-teal text-white hover:opacity-90" },
  { value: "completed", label: "Mark completed", tone: "bg-ink text-white hover:bg-teal" },
  { value: "cancelled", label: "Cancel", tone: "border border-danger text-danger hover:bg-danger/5" },
];

export default function BookingDetailDrawer({
  booking,
  onClose,
  onUpdate,
}: {
  booking: AgencyBooking;
  onClose: () => void;
  onUpdate: (booking: AgencyBooking) => void;
}) {
  const [note, setNote] = useState("");

  const setStatus = (status: AgencyBookingStatus) => {
    onUpdate({ ...booking, status });
  };

  const addNote = () => {
    if (!note.trim()) return;
    onUpdate({ ...booking, agencyNotes: [...booking.agencyNotes, { text: note.trim(), date: "Just now" }] });
    setNote("");
  };

  return (
    <div className="fixed inset-0 z-[80] flex justify-end">
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} />
      <div className="relative h-full w-full max-w-md overflow-y-auto bg-white p-6">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate hover:text-ink" aria-label="Close">
          <X size={20} />
        </button>

        <span className="font-mono text-[11px] text-slate">{booking.bookingNumber}</span>
        <h2 className="mt-1 font-display text-lg font-semibold text-ink">{booking.tour.title}</h2>
        <div className="mt-2 flex gap-2">
          <AgencyBookingStatusBadge status={booking.status} />
          <PaymentStatusBadge status={booking.paymentStatus} />
        </div>

        <div className="relative mt-4 h-32 w-full overflow-hidden rounded-xl">
          <Image src={booking.tour.image} alt={booking.tour.title} fill className="object-cover" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-[11px] text-slate">Booking date</span><p className="text-ink">{booking.bookingDate}</p></div>
          <div><span className="text-[11px] text-slate">Travel date</span><p className="text-ink">{booking.travelDate}</p></div>
          <div><span className="text-[11px] text-slate">Travellers</span><p className="text-ink">{booking.travellers}</p></div>
          <div><span className="text-[11px] text-slate">Amount</span><p className="font-mono text-ink">{formatINR(booking.totalAmount)}</p></div>
        </div>

        <h3 className="mt-6 font-display text-[14px] font-semibold text-ink">Customer details</h3>
        <div className="mt-2 flex flex-col gap-2 text-sm text-ink/80">
          <span className="font-medium text-ink">{booking.customerName}</span>
          <span className="inline-flex items-center gap-2"><Mail size={13} className="text-teal" /> {booking.customerEmail}</span>
          <span className="inline-flex items-center gap-2"><Phone size={13} className="text-teal" /> {booking.customerPhone}</span>
          <span className="inline-flex items-center gap-2"><MapPin size={13} className="text-teal" /> {booking.customerCity}</span>
        </div>

        {booking.specialRequest && (
          <div className="mt-4 rounded-xl bg-paper-soft p-3.5 text-[13px] text-ink/80">
            <span className="block text-[11px] font-medium text-slate">Special request</span>
            {booking.specialRequest}
          </div>
        )}

        <h3 className="mt-6 font-display text-[14px] font-semibold text-ink">Update status</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {STATUS_ACTIONS.filter((a) => a.value !== booking.status).map((a) => (
            <button
              key={a.value}
              onClick={() => setStatus(a.value)}
              className={cn("rounded-full px-4 py-2 text-[12.5px] font-medium", a.tone)}
            >
              {a.label}
            </button>
          ))}
        </div>

        <h3 className="mt-6 flex items-center gap-1.5 font-display text-[14px] font-semibold text-ink">
          <StickyNote size={14} /> Internal notes
        </h3>
        <div className="mt-2 flex flex-col gap-2">
          {booking.agencyNotes.map((n, i) => (
            <div key={i} className="rounded-xl border border-line p-3 text-[13px] text-ink/80">
              {n.text}
              <p className="mt-1 text-[10.5px] text-slate">{n.date}</p>
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note (only your team sees this)"
            className="flex-1 rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink"
          />
          <button onClick={addNote} className="rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-teal">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
