import { api } from "./client";
import type { Paginated } from "./types";

// -- Categories -------------------------------------------------------------
export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  is_active: boolean;
  sort_order: number;
}

export const fetchAdminCategories = () => api.get<ApiCategory[]>("/admin/categories");
export const createCategory = (data: Partial<ApiCategory>) => api.post<ApiCategory>("/admin/categories", data);
export const updateCategory = (id: number, data: Partial<ApiCategory>) => api.put<ApiCategory>(`/admin/categories/${id}`, data);
export const deleteCategory = (id: number) => api.delete<{ message: string }>(`/admin/categories/${id}`);

// -- Destinations -------------------------------------------------------------
export interface ApiDestination {
  id: number;
  name: string;
  slug: string;
  country: string;
  image_path: string | null;
  is_active: boolean;
  tours_count?: number;
}

export const fetchAdminDestinations = () => api.get<ApiDestination[]>("/admin/destinations");
export const createDestination = (data: Partial<ApiDestination>) => api.post<ApiDestination>("/admin/destinations", data);
export const updateDestination = (id: number, data: Partial<ApiDestination>) => api.put<ApiDestination>(`/admin/destinations/${id}`, data);
export const deleteDestination = (id: number) => api.delete<{ message: string }>(`/admin/destinations/${id}`);

// -- Coupons -------------------------------------------------------------
export interface ApiCoupon {
  id: number;
  code: string;
  type: "flat" | "percent";
  value: number;
  min_booking_amount: number | null;
  max_discount: number | null;
  usage_limit: number | null;
  used_count: number;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
  applicable_agency_id: number | null;
  agency?: { name: string } | null;
}

export const fetchAdminCoupons = () => api.get<Paginated<ApiCoupon>>("/admin/coupons");
export const createCoupon = (data: Partial<ApiCoupon>) => api.post<ApiCoupon>("/admin/coupons", data);
export const updateCoupon = (id: number, data: Partial<ApiCoupon>) => api.put<ApiCoupon>(`/admin/coupons/${id}`, data);
export const deleteCoupon = (id: number) => api.delete<{ message: string }>(`/admin/coupons/${id}`);

// -- Banners -------------------------------------------------------------
export interface ApiBanner {
  id: number;
  title: string | null;
  image_path: string;
  link_url: string | null;
  position: "homepage_hero" | "homepage_secondary" | "category_page";
  sort_order: number;
  is_active: boolean;
}

export const fetchAdminBanners = () => api.get<ApiBanner[]>("/admin/banners");
export const createBanner = (data: Partial<ApiBanner>) => api.post<ApiBanner>("/admin/banners", data);
export const updateBanner = (id: number, data: Partial<ApiBanner>) => api.put<ApiBanner>(`/admin/banners/${id}`, data);
export const deleteBanner = (id: number) => api.delete<{ message: string }>(`/admin/banners/${id}`);

// -- Blogs -------------------------------------------------------------
export interface ApiBlog {
  id: number;
  title: string;
  slug: string;
  category: string;
  status: "draft" | "published";
  published_at: string | null;
  author?: { name: string };
}

export const fetchAdminBlogs = (status?: string) => api.get<Paginated<ApiBlog>>(`/admin/blogs${status ? `?status=${status}` : ""}`);
export const createBlog = (data: Record<string, unknown>) => api.post<ApiBlog>("/admin/blogs", data);
export const updateBlog = (id: number, data: Record<string, unknown>) => api.put<ApiBlog>(`/admin/blogs/${id}`, data);
export const deleteBlog = (id: number) => api.delete<{ message: string }>(`/admin/blogs/${id}`);

// -- Pages -------------------------------------------------------------
export interface ApiPage {
  id: number;
  title: string;
  slug: string;
  status: "draft" | "published";
  updated_at: string;
}

export const fetchAdminPages = () => api.get<ApiPage[]>("/admin/pages");
export const createPage = (data: Partial<ApiPage> & { content: string }) => api.post<ApiPage>("/admin/pages", data);
export const updatePage = (id: number, data: Partial<ApiPage>) => api.put<ApiPage>(`/admin/pages/${id}`, data);
export const deletePage = (id: number) => api.delete<{ message: string }>(`/admin/pages/${id}`);

// -- Settings -------------------------------------------------------------
export const fetchAdminSettings = () => api.get<Record<string, { key: string; value: string; group: string }[]>>("/admin/settings");
export const saveAdminSettings = (settings: { key: string; value: string; group: string }[]) =>
  api.put<{ message: string }>("/admin/settings", { settings });

// -- Users -------------------------------------------------------------
export interface ApiAdminUser {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  bookings_count: number;
  created_at: string;
}

export const fetchAdminCustomers = (q?: string) => api.get<Paginated<ApiAdminUser>>(`/admin/users${q ? `?q=${q}` : ""}`);
export const toggleUserActive = (id: number) => api.patch<ApiAdminUser>(`/admin/users/${id}/toggle-active`);

// -- Global bookings -------------------------------------------------------------
export const fetchAdminAllBookings = (status?: string) =>
  api.get<Paginated<import("./types").ApiBooking>>(`/admin/bookings${status ? `?status=${status}` : ""}`);
