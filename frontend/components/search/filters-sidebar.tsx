"use client";

import { categories } from "@/lib/data";
import type { Transport } from "@/types";
import { cn } from "@/lib/utils";

export interface FilterState {
  categories: string[];
  transport: Transport[];
  budget: [number, number];
  hotelRating: number;
  freeCancellation: boolean;
  instantConfirmation: boolean;
  verifiedOnly: boolean;
  mealsIncluded: boolean;
}

export const DEFAULT_FILTERS: FilterState = {
  categories: [],
  transport: [],
  budget: [0, 200000],
  hotelRating: 0,
  freeCancellation: false,
  instantConfirmation: false,
  verifiedOnly: false,
  mealsIncluded: false,
};

const TRANSPORT_OPTIONS: Transport[] = ["Flight", "Train", "Bus", "Cab"];

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-line py-5 first:pt-0 last:border-b-0">
      <h3 className="mb-3 font-display text-[14px] font-semibold text-ink">{title}</h3>
      {children}
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-[13.5px] text-ink/80 hover:text-ink">
      <span
        className={cn(
          "grid h-4 w-4 shrink-0 place-items-center rounded border transition-colors",
          checked ? "border-ink bg-ink" : "border-line-strong bg-white"
        )}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}

export default function FiltersSidebar({
  filters,
  onChange,
  resultCount,
}: {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  resultCount: number;
}) {
  const toggle = <T,>(arr: T[], value: T): T[] =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  return (
    <aside className="rounded-[var(--radius-lg)] border border-line bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-ink">Filters</h2>
        <button
          onClick={() => onChange(DEFAULT_FILTERS)}
          className="text-xs font-medium text-slate hover:text-ink"
        >
          Reset all
        </button>
      </div>

      <p className="mb-2 text-xs text-slate">{resultCount} tours match</p>

      <FilterGroup title="Category">
        <div className="flex flex-col">
          {categories.slice(0, 8).map((c) => (
            <Checkbox
              key={c.slug}
              label={c.label}
              checked={filters.categories.includes(c.label)}
              onChange={() => onChange({ ...filters, categories: toggle(filters.categories, c.label) })}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Budget per person">
        <input
          type="range"
          min={0}
          max={200000}
          step={5000}
          value={filters.budget[1]}
          onChange={(e) => onChange({ ...filters, budget: [0, Number(e.target.value)] })}
          className="w-full accent-[var(--gold-deep)]"
        />
        <div className="mt-1 flex justify-between font-mono text-[11px] text-slate">
          <span>₹0</span>
          <span>Up to ₹{filters.budget[1].toLocaleString("en-IN")}</span>
        </div>
      </FilterGroup>

      <FilterGroup title="Transport">
        <div className="flex flex-wrap gap-2">
          {TRANSPORT_OPTIONS.map((t) => (
            <button
              key={t}
              onClick={() => onChange({ ...filters, transport: toggle(filters.transport, t) })}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                filters.transport.includes(t)
                  ? "border-ink bg-ink text-white"
                  : "border-line text-slate hover:border-ink hover:text-ink"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Hotel rating">
        <div className="flex gap-2">
          {[3, 4, 5].map((r) => (
            <button
              key={r}
              onClick={() => onChange({ ...filters, hotelRating: filters.hotelRating === r ? 0 : r })}
              className={cn(
                "flex-1 rounded-lg border px-2 py-2 text-xs font-medium transition-colors",
                filters.hotelRating === r
                  ? "border-ink bg-ink text-white"
                  : "border-line text-slate hover:border-ink hover:text-ink"
              )}
            >
              {r}★+
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Booking preferences">
        <div className="flex flex-col">
          <Checkbox
            label="Free cancellation"
            checked={filters.freeCancellation}
            onChange={() => onChange({ ...filters, freeCancellation: !filters.freeCancellation })}
          />
          <Checkbox
            label="Instant confirmation"
            checked={filters.instantConfirmation}
            onChange={() => onChange({ ...filters, instantConfirmation: !filters.instantConfirmation })}
          />
          <Checkbox
            label="Meals included"
            checked={filters.mealsIncluded}
            onChange={() => onChange({ ...filters, mealsIncluded: !filters.mealsIncluded })}
          />
          <Checkbox
            label="Verified agency only"
            checked={filters.verifiedOnly}
            onChange={() => onChange({ ...filters, verifiedOnly: !filters.verifiedOnly })}
          />
        </div>
      </FilterGroup>
    </aside>
  );
}
