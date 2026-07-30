import { api } from "./client";
import type { ApiTourDetail, ApiTourSummary, Paginated } from "./types";

export interface TourSearchParams {
  q?: string;
  category?: string;
  destination?: string;
  agency?: string;
  max_price?: number;
  transport?: string;
  hotel_rating?: number;
  free_cancellation?: boolean;
  instant_confirmation?: boolean;
  meals_included?: boolean;
  verified_only?: boolean;
  sort?: "popular" | "price-low" | "price-high" | "rating" | "newest";
  per_page?: number;
}

function toQueryString(params: TourSearchParams): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === "" || value === false) return;
    search.set(key, String(value));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export function fetchTours(params: TourSearchParams = {}) {
  return api.get<Paginated<ApiTourSummary>>(`/tours${toQueryString(params)}`, { skipAuth: true });
}

export function fetchFeaturedTours() {
  return api.get<{ data: ApiTourSummary[] }>("/tours/featured", { skipAuth: true });
}

export function fetchTrendingTours() {
  return api.get<{ data: ApiTourSummary[] }>("/tours/trending", { skipAuth: true });
}

export function fetchTourDetail(slug: string) {
  return api.get<{ data: ApiTourDetail }>(`/tours/${slug}`, { skipAuth: true });
}
