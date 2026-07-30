"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarDays, MapPin, Navigation, Search, SlidersHorizontal, Users, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

// City-search field has no backend endpoint to query, so this is a
// client-side filtered list of major Indian cities/destinations.
const INDIAN_CITIES = [
  "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad",
  "Jaipur", "Lucknow", "Surat", "Kanpur", "Nagpur", "Indore", "Bhopal", "Visakhapatnam",
  "Patna", "Vadodara", "Chandigarh", "Coimbatore", "Guwahati", "Bhubaneswar", "Dehradun",
  "Panaji (Goa)", "Kochi", "Mysuru", "Shimla", "Manali", "Leh", "Udaipur", "Jodhpur",
  "Mangaluru", "Thiruvananthapuram", "Darjeeling", "Rishikesh", "Puducherry", "Ooty",
  "Munnar", "Alleppey", "Jaisalmer", "Amritsar", "Srinagar", "Varanasi", "Agra", "Nashik",
];

function CityField({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  icon: typeof MapPin;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [focused, setFocused] = useState(false);
  const query = value.trim().toLowerCase();
  const matches = (query ? INDIAN_CITIES.filter((c) => c.toLowerCase().includes(query)) : INDIAN_CITIES).slice(0, 6);

  return (
    <div className="relative">
      <label className="flex items-center gap-2.5 rounded-xl px-3.5 py-2 hover:bg-paper-soft">
        <Icon size={16} className="shrink-0 text-slate" />
        <span className="flex flex-col">
          <span className="text-[11px] font-medium text-slate">{label}</span>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder={placeholder}
            className="w-full bg-transparent text-sm font-medium text-ink placeholder:text-slate-soft focus:outline-none"
          />
        </span>
      </label>

      {focused && matches.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-y-auto rounded-xl border border-line bg-white p-1.5 shadow-lg">
          {matches.map((city) => (
            <button
              key={city}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onChange(city);
                setFocused(false);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-paper-soft"
            >
              <MapPin size={14} className="text-slate" /> {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchBar() {
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [destination, setDestination] = useState("");
  const [expanded, setExpanded] = useState(false);

  const onSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set("q", destination);
    if (from) params.set("from", from);
    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="rounded-[var(--radius-lg)] border border-white/10 bg-white p-2 text-ink shadow-[0_30px_60px_-25px_rgba(0,0,0,0.5)] sm:p-3">
      <div className="grid grid-cols-1 divide-y divide-line sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-[1fr_1fr_0.85fr_0.85fr_auto]">
        <CityField label="From" icon={Navigation} value={from} onChange={setFrom} placeholder="Departure city" />
        <CityField label="Destination" icon={MapPin} value={destination} onChange={setDestination} placeholder="Where to?" />

        <label className="flex items-center gap-2.5 rounded-xl px-3.5 py-2 hover:bg-paper-soft">
          <CalendarDays size={16} className="shrink-0 text-slate" />
          <span className="flex flex-col">
            <span className="text-[11px] font-medium text-slate">Travel date</span>
            <input type="date" className="w-full bg-transparent text-sm font-medium text-ink focus:outline-none" />
          </span>
        </label>

        <label className="flex items-center gap-2.5 rounded-xl px-3.5 py-2 hover:bg-paper-soft">
          <Users size={16} className="shrink-0 text-slate" />
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

        <div className="flex items-center gap-2 py-2">
          <button
            onClick={() => setExpanded((v) => !v)}
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line text-slate transition-colors hover:text-ink",
              expanded && "bg-paper-soft text-ink"
            )}
            aria-label="More filters"
          >
            <SlidersHorizontal size={16} />
          </button>
          <button
            onClick={onSearch}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gold px-6 text-sm font-semibold text-ink transition-colors hover:bg-gold-deep lg:w-auto"
          >
            <Search size={16} /> Search
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
    </div>
  );
}
