import { api, apiUpload } from "./client";
import type { ApiBooking, ApiTourSummary, ApiVideo, Paginated } from "./types";

// -- Tours --------------------------------------------------------------

export function fetchAgencyTours(status?: string) {
  const query = status ? `?status=${status}` : "";
  return api.get<Paginated<ApiTourSummary>>(`/agency/tours${query}`);
}

export interface CreateTourPayload {
  destination_id: number;
  title: string;
  description?: string;
  price: number;
  original_price: number;
  duration_nights: number;
  duration_days: number;
  hotel_rating: number;
  transport: string[];
  meals_included: boolean;
  free_cancellation: boolean;
  instant_confirmation: boolean;
  highlights?: string[];
  inclusions?: string[];
  exclusions?: string[];
  things_to_carry?: string[];
  cancellation_policy?: string;
  category_ids: number[];
  itinerary?: { day_number: number; title: string; description?: string }[];
}

export async function createAgencyTour(payload: CreateTourPayload) {
  const res = await api.post<{ data: import("./types").ApiTourDetail }>("/agency/tours", payload);
  return res.data;
}

export async function updateAgencyTour(tourId: number, payload: Partial<CreateTourPayload>) {
  const res = await api.put<{ data: import("./types").ApiTourDetail }>(`/agency/tours/${tourId}`, payload);
  return res.data;
}

export function deleteAgencyTour(tourId: number) {
  return api.delete<{ message: string }>(`/agency/tours/${tourId}`);
}

export async function duplicateAgencyTour(tourId: number) {
  const res = await api.post<{ data: ApiTourSummary }>(`/agency/tours/${tourId}/duplicate`);
  return res.data;
}

export interface AddTourDatePayload {
  departure_date: string;
  return_date?: string;
  seats_total: number;
  price_override?: number;
}

export function addAgencyTourDate(tourId: number, payload: AddTourDatePayload) {
  return api.post(`/agency/tours/${tourId}/dates`, payload);
}

export function closeAgencyTourDate(tourId: number, tourDateId: number) {
  return api.patch(`/agency/tours/${tourId}/dates/${tourDateId}/close`);
}

// -- Bookings -------------------------------------------------------------

export function fetchAgencyBookings(status?: string) {
  const query = status ? `?status=${status}` : "";
  return api.get<Paginated<ApiBooking>>(`/agency/bookings${query}`);
}

// -- Videos ---------------------------------------------------------------

export function fetchAgencyVideos() {
  return api.get<Paginated<ApiVideo>>("/agency/videos");
}

export async function uploadAgencyVideo(input: { title: string; description?: string; video: File; thumbnail?: File }) {
  const form = new FormData();
  form.append("title", input.title);
  if (input.description) form.append("description", input.description);
  form.append("video", input.video);
  if (input.thumbnail) form.append("thumbnail", input.thumbnail);

  const res = await apiUpload<{ data: ApiVideo }>("/agency/videos", form);
  return res.data;
}

export function deleteAgencyVideo(videoId: number) {
  return api.delete<{ message: string }>(`/agency/videos/${videoId}`);
}

export async function updateAgencyBookingStatus(
  bookingId: number,
  status: "confirmed" | "cancelled" | "completed",
  options?: { reason?: string; agency_notes?: string }
) {
  const res = await api.patch<{ data: ApiBooking }>(`/agency/bookings/${bookingId}/status`, {
    status,
    ...options,
  });
  return res.data;
}
