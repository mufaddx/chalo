"use client";

import { ArrowDownAZ, LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export type SortOption = "popular" | "price-low" | "price-high" | "newest" | "rating";

const SORT_LABELS: Record<SortOption, string> = {
  popular: "Most popular",
  "price-low": "Price: Low to high",
  "price-high": "Price: High to low",
  newest: "Newest first",
  rating: "Highest rated",
};

export default function SortBar({
  resultCount,
  sort,
  onSortChange,
  view,
  onViewChange,
  onOpenMobileFilters,
}: {
  resultCount: number;
  sort: SortOption;
  onSortChange: (s: SortOption) => void;
  view: "grid" | "list";
  onViewChange: (v: "grid" | "list") => void;
  onOpenMobileFilters: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink">
          {resultCount} tours found
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenMobileFilters}
          className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-2 text-xs font-medium text-ink lg:hidden"
        >
          <SlidersHorizontal size={14} /> Filters
        </button>

        <div className="relative">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="appearance-none rounded-full border border-line bg-white py-2 pl-3 pr-8 text-xs font-medium text-ink focus:outline-none"
          >
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <ArrowDownAZ size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate" />
        </div>

        <div className="hidden items-center gap-1 rounded-full border border-line p-1 sm:flex">
          <button
            onClick={() => onViewChange("grid")}
            className={cn("grid h-7 w-7 place-items-center rounded-full", view === "grid" ? "bg-ink text-white" : "text-slate")}
            aria-label="Grid view"
          >
            <LayoutGrid size={13} />
          </button>
          <button
            onClick={() => onViewChange("list")}
            className={cn("grid h-7 w-7 place-items-center rounded-full", view === "list" ? "bg-ink text-white" : "text-slate")}
            aria-label="List view"
          >
            <List size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
