import { getAgencyBySlug, getToursByAgency } from "@/lib/data";
import type { Agency, Tour } from "@/types";
import { apiAgencyToAgency, apiSummaryToTour } from "./adapters";
import { fetchAgencyDetail } from "./agencies";
import { fetchTours } from "./tours";

export interface AgencyLookupResult {
  agency: Agency;
  tours: Tour[];
  source: "live" | "demo";
}

/**
 * Mirrors lib/api/get-tour.ts's pattern: try the real API first (the agency
 * detail endpoint, plus the tours endpoint filtered to that agency — the
 * `agency` query param added to GET /api/tours specifically to unblock this
 * page), fall back to the bundled mock agency on any failure.
 */
export async function getAgencyForProfile(slug: string): Promise<AgencyLookupResult | null> {
  try {
    const [agency, toursRes] = await Promise.all([
      fetchAgencyDetail(slug),
      fetchTours({ agency: slug, per_page: 50 }),
    ]);
    return {
      agency: apiAgencyToAgency(agency),
      tours: toursRes.data.map(apiSummaryToTour),
      source: "live",
    };
  } catch {
    const mock = getAgencyBySlug(slug);
    if (!mock) return null;
    return { agency: mock, tours: getToursByAgency(slug), source: "demo" };
  }
}
