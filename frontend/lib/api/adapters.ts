import type { Agency, Tour, TourCategory, Transport } from "@/types";
import type { ApiAgency, ApiTourDetail, ApiTourSummary } from "./types";

function placeholderImage(seed: string, w = 1200, h = 800) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

function apiAgencyRefToAgency(ref: ApiTourSummary["agency"], fallbackSlug: string): Agency {
  return {
    slug: ref?.slug ?? fallbackSlug,
    name: ref?.name ?? "Verified agency",
    logo: ref?.logo_path || placeholderImage(`agency-${ref?.slug ?? fallbackSlug}`, 200, 200),
    cover: "",
    verified: ref?.verified ?? false,
    yearsExperience: 0,
    totalTours: 0,
    completedTours: 0,
    rating: 0,
    reviewCount: 0,
    city: "",
    about: "",
    phone: "",
    email: "",
    website: "",
  };
}

/**
 * The tour listing endpoint (GET /api/tours) returns a lighter shape than
 * the detail endpoint — no gallery, itinerary, or full agency profile. Those
 * fields get sensible empty defaults; TourCard never reads them.
 *
 * `seatsLeft` in particular isn't exposed at summary level, so it's set high
 * enough to never trigger the "only N seats left" urgency badge — showing an
 * invented low number would be actively misleading.
 */
export function apiSummaryToTour(t: ApiTourSummary): Tour {
  return {
    slug: t.slug,
    title: t.title,
    destination: t.destination?.name ?? "—",
    country: t.destination?.country ?? "",
    image: t.cover_image || placeholderImage(`tour-${t.slug}`),
    gallery: [],
    agency: apiAgencyRefToAgency(t.agency, "agency"),
    category: (t.categories ?? []) as TourCategory[],
    price: t.price,
    originalPrice: t.original_price,
    duration: t.duration,
    nights: 0,
    days: 0,
    transport: t.transport as Transport[],
    hotelRating: t.hotel_rating,
    mealsIncluded: t.meals_included,
    freeCancellation: t.free_cancellation,
    instantConfirmation: t.instant_confirmation,
    rating: t.rating_avg,
    reviewCount: t.review_count,
    seatsLeft: 99,
    nextDepartures: t.next_departures ?? [],
    highlights: [],
    inclusions: [],
    exclusions: [],
    thingsToCarry: [],
    itinerary: [],
    reviews: [],
    featured: t.featured,
    trending: t.trending,
  };
}

/** Full detail payload — everything TourCard *and* the tour detail page need. */
export function apiDetailToTour(t: ApiTourDetail): Tour {
  const base = apiSummaryToTour(t);
  return {
    ...base,
    gallery: t.gallery.length ? t.gallery.map((g) => g.path) : [base.image],
    highlights: t.highlights ?? [],
    inclusions: t.inclusions ?? [],
    exclusions: t.exclusions ?? [],
    thingsToCarry: t.things_to_carry ?? [],
    itinerary: t.itinerary.map((d) => ({
      day: d.day,
      title: d.title,
      description: d.description ?? "",
      meals: d.meals,
      stay: d.stay ?? undefined,
    })),
    nextDepartures: t.tour_dates.filter((d) => d.status === "open").map((d) => d.departure_date),
    seatsLeft: t.tour_dates.find((d) => d.status === "open")?.seats_available ?? base.seatsLeft,
    reviews: t.reviews.map((r) => ({
      id: String(r.id),
      author: r.author ?? "Voyagr traveller",
      rating: r.rating,
      date: new Date(r.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      text: r.review_text ?? "",
      images: r.images ?? undefined,
      agencyReply: r.agency_reply ?? undefined,
    })),
  };
}

export function apiAgencyToAgency(a: ApiAgency): Agency {
  return {
    slug: a.slug,
    name: a.name,
    logo: a.logo_path || placeholderImage(`agency-${a.slug}`, 200, 200),
    cover: a.cover_path || placeholderImage(`agency-cover-${a.slug}`, 1600, 500),
    verified: a.verified,
    yearsExperience: a.years_experience ?? 0,
    totalTours: a.tour_count ?? 0,
    completedTours: 0,
    rating: a.rating_avg,
    reviewCount: a.review_count,
    followersCount: a.followers_count ?? 0,
    city: a.city ?? "",
    about: a.about ?? "",
    phone: a.phone ?? "",
    email: a.email ?? "",
    website: a.website ?? "",
  };
}
