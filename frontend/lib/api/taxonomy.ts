import { api } from "./client";

export interface PublicCategory {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
}

export interface PublicDestination {
  id: number;
  name: string;
  slug: string;
  country: string;
}

export const fetchPublicCategories = () => api.get<PublicCategory[]>("/categories", { skipAuth: true });
export const fetchPublicDestinations = () => api.get<PublicDestination[]>("/destinations", { skipAuth: true });
