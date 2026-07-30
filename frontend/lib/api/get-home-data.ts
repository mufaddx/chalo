import { featuredTours, trendingTours, tours as mockTours } from "@/lib/data";
import type { Tour } from "@/types";
import { apiSummaryToTour } from "./adapters";
import { fetchFeaturedTours, fetchTrendingTours } from "./tours";

export interface HomeData {
  featured: Tour[];
  trending: Tour[];
  upcoming: Tour[];
  source: "live" | "demo";
}

/**
 * All-or-nothing on purpose: if either live call fails, the whole home page
 * falls back to mock together rather than mixing live featured tours with
 * mock trending tours, which would be a confusing, internally-inconsistent
 * page (and would make the single source banner at the top a lie for half
 * the page).
 */
export async function getHomeData(): Promise<HomeData> {
  try {
    const [featuredRes, trendingRes] = await Promise.all([fetchFeaturedTours(), fetchTrendingTours()]);
    const featured = featuredRes.data.map(apiSummaryToTour);
    const trending = trendingRes.data.map(apiSummaryToTour);
    return { featured, trending, upcoming: [...trending, ...featured].slice(0, 4), source: "live" };
  } catch {
    return {
      featured: featuredTours,
      trending: trendingTours,
      upcoming: [...mockTours].reverse().slice(0, 4),
      source: "demo",
    };
  }
}
