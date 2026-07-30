// Mirrors app/Http/Resources/*.php and the auth endpoints in the backend
// package (voyagr-travel-marketplace-backend.zip). Kept separate from the
// frontend's own `types/index.ts` (used by the mock-data pages) since the
// shapes differ slightly — e.g. the API returns snake_case-free camel data
// already normalised by Resources, but field sets aren't 1:1 with the mocks.

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: "customer" | "agency" | "admin";
  avatar_path: string | null;
}

export interface AuthResponse {
  user: ApiUser;
  token: string;
}

export interface ApiTourSummary {
  id: number;
  slug: string;
  title: string;
  destination?: { name: string; country: string; slug: string };
  agency?: { name: string; slug: string; logo_path: string | null; verified: boolean };
  price: number;
  original_price: number;
  discount_percent: number;
  duration: string;
  hotel_rating: number;
  transport: string[];
  meals_included: boolean;
  free_cancellation: boolean;
  instant_confirmation: boolean;
  rating_avg: number;
  review_count: number;
  featured: boolean;
  trending: boolean;
  categories?: string[];
  cover_image?: string | null;
  next_departures?: string[];
}

export interface ApiTourDetail extends ApiTourSummary {
  description: string | null;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  things_to_carry: string[];
  cancellation_policy: string | null;
  gallery: { path: string; type: "image" | "video" }[];
  itinerary: { day: number; title: string; description: string | null; meals: string[]; stay: string | null }[];
  tour_dates: { id: number; departure_date: string; seats_available: number; status: string }[];
  reviews: ApiReview[];
}

export interface ApiReview {
  id: number;
  author?: string;
  rating: number;
  review_text: string | null;
  images: string[] | null;
  agency_reply: string | null;
  created_at: string;
}

export interface ApiAgency {
  id: number;
  slug: string;
  name: string;
  logo_path: string | null;
  cover_path: string | null;
  about: string | null;
  city: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  verified: boolean;
  status: "pending" | "verified" | "rejected" | "suspended";
  rejection_reason: string | null;
  years_experience: number | null;
  rating_avg: number;
  review_count: number;
  tour_count?: number;
  owner_email?: string;
  created_at?: string;
  verifications?: { document_type: string; document_path: string; status: string }[];
}

export interface ApiBooking {
  id: number;
  booking_number: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  payment_status: "unpaid" | "partial" | "paid" | "refunded";
  tour?: { title: string; slug: string };
  agency?: { name: string; slug: string };
  travel_date?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_city?: string | null;
  special_request?: string | null;
  agency_notes?: string | null;
  cancelled_reason?: string | null;
  adults: number;
  children: number;
  total_amount: number;
  created_at: string;
}

export interface Paginated<T> {
  data: T[];
  links?: { first: string; last: string; prev: string | null; next: string | null };
  meta?: { current_page: number; last_page: number; total: number };
}
