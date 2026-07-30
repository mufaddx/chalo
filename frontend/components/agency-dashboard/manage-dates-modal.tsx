"use client";

import { useState } from "react";
import { CalendarPlus, Lock, Unlock, X } from "lucide-react";
import type { Tour } from "@/types";

interface DateRow {
  date: string;
  seatsTotal: number;
  seatsLeft: number;
  closed: boolean;
}

export default function ManageDatesModal({ tour, onClose }: { tour: Tour; onClose: () => void }) {
  const [rows, setRows] = useState<DateRow[]>(
    tour.nextDepartures.map((d, i) => ({ date: d, seatsTotal: 12, seatsLeft: tour.seatsLeft + i, closed: false }))
  );
  const [newDate, setNewDate] = useState("");
  const [newSeats, setNewSeats] = useState(12);

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-[var(--radius-lg)] bg-white p-6 sm:rounded-[var(--radius-lg)]">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate hover:text-ink" aria-label="Close">
          <X size={20} />
        </button>
        <h3 className="font-display text-lg font-semibold text-ink">Departure dates &amp; seats</h3>
        <p className="mt-1 text-sm text-slate">{tour.title}</p>

        <div className="mt-4 flex flex-col divide-y divide-line rounded-xl border border-line">
          {rows.map((row, i) => (
            <div key={row.date} className="flex items-center justify-between gap-3 p-3">
              <div>
                <p className="text-[14px] font-medium text-ink">{row.date}</p>
                <p className="text-[12px] text-slate">{row.seatsLeft} / {row.seatsTotal} seats available</p>
              </div>
              <button
                onClick={() => setRows((prev) => prev.map((r, idx) => idx === i ? { ...r, closed: !r.closed } : r))}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium ${row.closed ? "border-line text-slate" : "border-teal text-teal"}`}
              >
                {row.closed ? <><Unlock size={12} /> Reopen</> : <><Lock size={12} /> Close booking</>}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <h4 className="text-[13px] font-medium text-slate">Add a new departure date</h4>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="flex-1 rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink"
            />
            <input
              type="number"
              min={1}
              max={100}
              value={newSeats}
              onChange={(e) => setNewSeats(Number(e.target.value))}
              className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink sm:w-28"
              placeholder="Seats"
            />
            <button
              onClick={() => {
                if (!newDate) return;
                setRows((prev) => [...prev, { date: newDate, seatsTotal: newSeats, seatsLeft: newSeats, closed: false }]);
                setNewDate("");
              }}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-teal"
            >
              <CalendarPlus size={15} /> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
