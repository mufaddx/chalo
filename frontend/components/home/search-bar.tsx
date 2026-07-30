"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarDays, MapPin, Search, SlidersHorizontal, Sparkles, Users, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "Weekend beach trip under ₹15,000",
  "Honeymoon package with private pool villa",
  "Family-friendly hill station, 4+ nights",
  "Solo trek with a small group",
];

export default function SearchBar() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [expanded, setExpanded] = useState(false);

  const onSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set("q", destination);
    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="rounded-[var(--radius-lg)] border border-white/10 bg-white p-2 text-ink shadow-[0_30px_60px_-25px_rgba(0,0,0,0.5)] sm:p-3">
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-[1.4fr_1fr_1fr_auto] sm:divide-x sm:divide-line">
        <label className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-paper-soft">
          <MapPin size={17} className="shrink-0 text-slate" />
          <span className="flex flex-col">
            <span className="text-[11px] font-medium text-slate">Destination</span>
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where to?"
              className="w-full bg-transparent text-sm font-medium text-ink placeholder:text-slate-soft focus:outline-none"
            />
          </span>
        </label>

        <label className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-paper-soft">
          <CalendarDays size={17} className="shrink-0 text-slate" />
          <span className="flex flex-col">
            <span className="text-[11px] font-medium text-slate">Travel date</span>
            <input type="date" className="w-full bg-transparent text-sm font-medium text-ink focus:outline-none" />
          </span>
        </label>

        <label className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-paper-soft">
          <Users size={17} className="shrink-0 text-slate" />
          <span className="flex flex-col">
            <span className="text-[11px] font-medium text-slate">Travellers</span>
            <select className="w-full bg-transparent text-sm font-medium text-ink focus:outline-none">
              <option>2 Adults</option>
              <option>1 Adult</option>
              <option>2 Adults, 1 Child</option>
              <option>4 Adults</option>
            </select>
          </span>
        </label>

        <div className="flex items-center gap-2 p-2">
          <button
            onClick={() => setExpanded((v) => !v)}
            className={cn(
              "hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line text-slate transition-colors hover:text-ink sm:flex",
              expanded && "bg-paper-soft text-ink"
            )}
            aria-label="More filters"
          >
            <SlidersHorizontal size={17} />
          </button>
          <button
            onClick={onSearch}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gold px-6 text-sm font-semibold text-ink transition-colors hover:bg-gold-deep sm:w-auto"
          >
            <Search size={17} /> Search
          </button>
        </div>
      </div>

      {expanded && (
        <div className="grid grid-cols-2 gap-2 border-t border-line p-3 sm:grid-cols-4">
          <label className="flex items-center gap-2 rounded-xl border border-line px-3 py-2.5">
            <Wallet size={15} className="text-slate" />
            <select className="w-full bg-transparent text-sm text-ink focus:outline-none">
              <option>Any budget</option>
              <option>Under ₹15,000</option>
              <option>₹15,000 – ₹40,000</option>
              <option>₹40,000+</option>
            </select>
          </label>
          <select className="rounded-xl border border-line px-3 py-2.5 text-sm text-ink focus:outline-none">
            <option>Any duration</option>
            <option>Weekend (2–3D)</option>
            <option>4–6 days</option>
            <option>7+ days</option>
          </select>
          <select className="rounded-xl border border-line px-3 py-2.5 text-sm text-ink focus:outline-none">
            <option>Any category</option>
            <option>Adventure</option>
            <option>Honeymoon</option>
            <option>Family</option>
            <option>Luxury</option>
          </select>
          <select className="rounded-xl border border-line px-3 py-2.5 text-sm text-ink focus:outline-none">
            <option>Any transport</option>
            <option>Flight</option>
            <option>Train</option>
            <option>Bus</option>
          </select>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 px-3 pb-2 pt-3">
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gold-deep">
          <Sparkles size={12} /> Try:
        </span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setDestination(s)}
            className="rounded-full border border-line px-3 py-1.5 text-xs text-slate transition-colors hover:border-ink hover:text-ink"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
