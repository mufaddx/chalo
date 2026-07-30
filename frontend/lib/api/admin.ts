import { api } from "./client";
import type { ApiAgency, ApiTourDetail, Paginated } from "./types";

export interface AdminDashboardStats {
  agencies: { total: number; pending: number; verified: number };
  tours: { total: number; pending_approval: number; published: number };
  bookings: { total: number; pending: number; confirmed: number; revenue_this_month: number };
  customers: number;
  recent_bookings: unknown[];
}

export function fetchAdminDashboard() {
  return api.get<AdminDashboardStats>("/admin/dashboard");
}

// -- Agencies -------------------------------------------------------------

export function fetchAdminAgencies(status?: string) {
  const query = status ? `?status=${status}` : "";
  return api.get<Paginated<ApiAgency>>(`/admin/agencies${query}`);
}

async function unwrap<T>(promise: Promise<{ data: T }>) {
  return (await promise).data;
}

export function approveAgency(agencyId: number) {
  return unwrap(api.post<{ data: ApiAgency }>(`/admin/agencies/${agencyId}/approve`));
}

export function rejectAgency(agencyId: number, reason: string) {
  return unwrap(api.post<{ data: ApiAgency }>(`/admin/agencies/${agencyId}/reject`, { reason }));
}

export function suspendAgency(agencyId: number, reason: string) {
  return unwrap(api.post<{ data: ApiAgency }>(`/admin/agencies/${agencyId}/suspend`, { reason }));
}

// -- Tours ------------------------------------------------------------------

export function fetchAdminTours(status?: string) {
  const query = status ? `?status=${status}` : "?status=pending_approval";
  return api.get<Paginated<ApiTourDetail>>(`/admin/tours${query}`);
}

export function approveTour(tourId: number) {
  return unwrap(api.post<{ data: ApiTourDetail }>(`/admin/tours/${tourId}/approve`));
}

export function rejectTour(tourId: number, reason: string) {
  return unwrap(api.post<{ data: ApiTourDetail }>(`/admin/tours/${tourId}/reject`, { reason }));
}

export function toggleTourFeatured(tourId: number) {
  return unwrap(api.patch<{ data: ApiTourDetail }>(`/admin/tours/${tourId}/featured`));
}
