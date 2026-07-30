import { api } from "./client";
import type { ApiAgency, Paginated } from "./types";

export function fetchAgencies() {
  return api.get<Paginated<ApiAgency>>("/agencies", { skipAuth: true });
}

export async function fetchAgencyDetail(slug: string) {
  const res = await api.get<{ data: ApiAgency }>(`/agencies/${slug}`, { skipAuth: true });
  return res.data;
}
