import { api } from "./client";
import type { ApiBooking, ApiTourSummary, Paginated } from "./types";

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
