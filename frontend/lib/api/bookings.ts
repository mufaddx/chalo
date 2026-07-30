import { api } from "./client";
import type { ApiBooking, Paginated } from "./types";

export interface CreateBookingPayload {
  tour_date_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_city?: string;
  adults: number;
  children?: number;
  special_request?: string;
  travellers?: { full_name: string; age?: number; gender?: string; passport_number?: string }[];
}

// Laravel's JsonResource wraps a single resource as { data: {...} } by
// default (only paginated ::collection() calls get the extra links/meta on
// top) — these three all hit single-resource endpoints, so all three unwrap.

export async function createBooking(tourSlug: string, payload: CreateBookingPayload) {
  const res = await api.post<{ data: ApiBooking }>(`/tours/${tourSlug}/bookings`, payload, { skipAuth: true });
  return res.data;
}

export function fetchMyBookings(status?: string) {
  const query = status ? `?status=${status}` : "";
  return api.get<Paginated<ApiBooking>>(`/me/bookings${query}`);
}

export async function requestCancellation(bookingId: number, reason?: string) {
  const res = await api.patch<{ data: ApiBooking }>(`/me/bookings/${bookingId}/cancel`, { reason });
  return res.data;
}
