import { getTourBySlug } from "@/lib/data";
import type { Tour } from "@/types";
import { apiDetailToTour } from "./adapters";
import { fetchTourDetail } from "./tours";
import type { ApiTourDetail } from "./types";

export interface TourLookupResult {
  tour: Tour;
  source: "live" | "demo";
  /** Only present when source === "live" — real backend IDs needed to book a specific date. */
  apiTourDates?: ApiTourDetail["tour_dates"];
}

/**
 * Server-side lookup used by the tour detail page. Tries the real backend
 * first; on any failure (offline, 404, etc.) falls back to the bundled mock
 * tour with the same slug, so the page still renders something sensible
 * without a live backend. generateStaticParams below is mock-slug-based, so
 * this fallback is what keeps `next build` succeeding in an environment
 * where the backend isn't reachable.
 */
export async function getTourForDetail(slug: string): Promise<TourLookupResult | null> {
  try {
    const res = await fetchTourDetail(slug);
    return { tour: apiDetailToTour(res.data), source: "live", apiTourDates: res.data.tour_dates };
  } catch {
    const mock = getTourBySlug(slug);
    return mock ? { tour: mock, source: "demo" } : null;
  }
}
