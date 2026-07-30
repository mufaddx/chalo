"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { tours as mockTours } from "@/lib/data";
import type { Tour } from "@/types";
import { fetchTours, type TourSearchParams } from "@/lib/api/tours";
import { apiSummaryToTour } from "@/lib/api/adapters";
import TourCard from "@/components/shared/tour-card";
import FiltersSidebar, { DEFAULT_FILTERS, type FilterState } from "@/components/search/filters-sidebar";
import SortBar, { type SortOption } from "@/components/search/sort-bar";
import { DemoDataBanner, LiveDataBanner } from "@/components/dashboard/data-source-banner";

function filterMockLocally(query: string, filters: FilterState, sort: SortOption): Tour[] {
  const list = mockTours.filter((t) => {
    if (query && !`${t.title} ${t.destination} ${t.country}`.toLowerCase().includes(query.toLowerCase())) return false;
    if (filters.categories.length && !t.category.some((c) => filters.categories.includes(c))) return false;
    if (filters.transport.length && !t.transport.some((tr) => filters.transport.includes(tr))) return false;
    if (t.price > filters.budget[1]) return false;
    if (filters.hotelRating && t.hotelRating < filters.hotelRating) return false;
    if (filters.freeCancellation && !t.freeCancellation) return false;
    if (filters.instantConfirmation && !t.instantConfirmation) return false;
    if (filters.mealsIncluded && !t.mealsIncluded) return false;
    if (filters.verifiedOnly && !t.agency.verified) return false;
    return true;
  });

  switch (sort) {
    case "price-low": return [...list].sort((a, b) => a.price - b.price);
    case "price-high": return [...list].sort((a, b) => b.price - a.price);
    case "rating": return [...list].sort((a, b) => b.rating - a.rating);
    case "newest": return [...list].reverse();
    default: return [...list].sort((a, b) => b.reviewCount - a.reviewCount);
  }
}

function toApiParams(query: string, filters: FilterState, sort: SortOption): TourSearchParams {
  return {
    q: query || undefined,
    category: filters.categories[0] || undefined, // API filters one category at a time
    transport: filters.transport[0] || undefined,
    max_price: filters.budget[1] < 200000 ? filters.budget[1] : undefined,
    hotel_rating: filters.hotelRating || undefined,
    free_cancellation: filters.freeCancellation || undefined,
    instant_confirmation: filters.instantConfirmation || undefined,
    meals_included: filters.mealsIncluded || undefined,
    verified_only: filters.verifiedOnly || undefined,
    sort,
    per_page: 24,
  };
}

function SearchResults() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortOption>("popular");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [dataSource, setDataSource] = useState<"loading" | "live" | "offline">("loading");
  const [liveResults, setLiveResults] = useState<Tour[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchTours(toApiParams(query, filters, sort))
      .then((res) => {
        if (cancelled) return;
        setLiveResults(res.data.map(apiSummaryToTour));
        setDataSource("live");
      })
      .catch(() => {
        if (cancelled) return;
        setDataSource("offline");
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filters, sort]);

  const mockResults = useMemo(() => filterMockLocally(query, filters, sort), [query, filters, sort]);
  const usingLive = dataSource === "live";
  const results = usingLive ? liveResults : mockResults;

  return (
    <div className="container-page py-8 sm:py-12">
      {dataSource === "live" && <LiveDataBanner />}
      {dataSource === "offline" && <DemoDataBanner reason="offline" />}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search destination, tour or agency..."
            className="h-12 w-full rounded-full border border-line bg-white px-5 text-sm text-ink placeholder:text-slate-soft focus:outline-none focus:border-ink"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <FiltersSidebar filters={filters} onChange={setFilters} resultCount={results.length} />
          </div>
        </div>

        <div>
          <SortBar
            resultCount={results.length}
            sort={sort}
            onSortChange={setSort}
            view={view}
            onViewChange={setView}
            onOpenMobileFilters={() => setMobileFiltersOpen(true)}
          />

          {results.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-24 text-center">
              <h3 className="font-display text-lg font-semibold text-ink">No tours match those filters</h3>
              <p className="max-w-sm text-sm text-slate">Try widening your budget range or clearing a filter or two.</p>
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="mt-3 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div
              className={
                view === "grid"
                  ? "mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
                  : "mt-6 flex flex-col gap-4"
              }
            >
              {results.map((tour) => (
                <TourCard key={tour.slug} tour={tour} horizontal={view === "list"} />
              ))}
            </div>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-[86%] max-w-sm overflow-y-auto bg-paper-soft p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-display text-base font-semibold">Filters</span>
              <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
                <X size={20} />
              </button>
            </div>
            <FiltersSidebar filters={filters} onChange={setFilters} resultCount={results.length} />
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-4 w-full rounded-full bg-ink py-3 text-sm font-medium text-white"
            >
              Show {results.length} tours
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container-page py-24 text-center text-sm text-slate">Loading tours…</div>}>
      <SearchResults />
    </Suspense>
  );
}
