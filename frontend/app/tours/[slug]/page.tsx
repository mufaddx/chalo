import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck, Bus, Check, ChevronRight, Clock3, MapPin, Plane, ShieldCheck,
  Train, Utensils, X as XIcon,
} from "lucide-react";
import { getRelatedTours, getTourBySlug, tours } from "@/lib/data";
import { getTourForDetail } from "@/lib/api/get-tour";
import { formatINR } from "@/lib/utils";
import StarRating from "@/components/shared/star-rating";
import TourCard from "@/components/shared/tour-card";
import TourGallery from "@/components/tour/gallery";
import Itinerary from "@/components/tour/itinerary";
import BookingPanel from "@/components/tour/booking-panel";
import ReviewsSection from "@/components/tour/reviews-section";
import { DemoDataBanner, LiveDataBanner } from "@/components/dashboard/data-source-banner";

const TRANSPORT_ICON = { Flight: Plane, Train, Bus, Cab: Bus } as const;

export function generateStaticParams() {
  return tours.map((t) => ({ slug: t.slug }));
}

export default async function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lookup = await getTourForDetail(slug);
  if (!lookup) notFound();
  const { tour, source, apiTourDates } = lookup;

  const related = getRelatedTours(getTourBySlug(tour.slug) ?? tour);

  return (
    <div className="pb-20">
      <div className="container-page pt-6">
        {source === "live" && <LiveDataBanner />}
        {source === "demo" && <DemoDataBanner reason="offline" />}
        <nav className="mb-4 flex items-center gap-1.5 text-xs text-slate">
          <Link href="/" className="hover:text-ink">Home</Link>
          <ChevronRight size={12} />
          <Link href="/search" className="hover:text-ink">Tours</Link>
          <ChevronRight size={12} />
          <span className="text-ink">{tour.destination}</span>
        </nav>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {tour.category.map((c) => (
                <span key={c} className="rounded-full bg-paper-soft px-2.5 py-1 text-[11px] font-medium text-slate">{c}</span>
              ))}
            </div>
            <h1 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-[32px]">{tour.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate">
              <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> {tour.destination}, {tour.country}</span>
              <span className="inline-flex items-center gap-1.5"><Clock3 size={14} /> {tour.duration}</span>
              <span className="inline-flex items-center gap-1.5"><StarRating rating={tour.rating} size={13} showValue /> ({tour.reviewCount} reviews)</span>
            </div>
          </div>
          <Link href={`/agencies/${tour.agency.slug}`} className="flex shrink-0 items-center gap-2 rounded-full border border-line px-3 py-2">
            <span className="relative h-8 w-8 overflow-hidden rounded-full bg-paper-dim">
              <Image src={tour.agency.logo} alt={tour.agency.name} fill className="object-cover" />
            </span>
            <span className="text-left">
              <span className="flex items-center gap-1 text-[13px] font-medium text-ink">
                {tour.agency.name} {tour.agency.verified && <BadgeCheck size={13} className="text-teal" />}
              </span>
              <span className="text-[11px] text-slate">{tour.agency.city}</span>
            </span>
          </Link>
        </div>
      </div>

      <div className="container-page mt-5">
        <TourGallery images={tour.gallery} title={tour.title} />
      </div>

      <div className="container-page mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0">
          {/* Overview */}
          <section>
            <h2 className="font-display text-xl font-semibold text-ink">Overview</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-line p-3">
                <span className="text-[11px] text-slate">Duration</span>
                <p className="mt-0.5 text-sm font-medium text-ink">{tour.duration}</p>
              </div>
              <div className="rounded-xl border border-line p-3">
                <span className="text-[11px] text-slate">Hotel rating</span>
                <p className="mt-0.5 text-sm font-medium text-ink">{tour.hotelRating}★ properties</p>
              </div>
              <div className="rounded-xl border border-line p-3">
                <span className="text-[11px] text-slate">Transport</span>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-ink">
                  {tour.transport.map((t) => {
                    const Icon = TRANSPORT_ICON[t];
                    return <Icon key={t} size={14} />;
                  })}
                </p>
              </div>
              <div className="rounded-xl border border-line p-3">
                <span className="text-[11px] text-slate">Group size</span>
                <p className="mt-0.5 text-sm font-medium text-ink">Max 12 travellers</p>
              </div>
            </div>

            <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {tour.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-[14px] text-ink/80">
                  <Check size={16} className="mt-0.5 shrink-0 text-teal" /> {h}
                </li>
              ))}
            </ul>
          </section>

          <hr className="my-8 border-line" />

          {/* Itinerary */}
          <section>
            <h2 className="font-display text-xl font-semibold text-ink">Day-wise itinerary</h2>
            <div className="mt-6">
              <Itinerary days={tour.itinerary} />
            </div>
          </section>

          <hr className="my-8 border-line" />

          {/* Hotel & transport */}
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">Stay & meals</h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-ink/80">
                <StarRating rating={tour.hotelRating} size={13} /> {tour.hotelRating}-star hotels & camps
              </p>
              <p className="mt-1.5 flex items-center gap-2 text-sm text-ink/80">
                <Utensils size={14} className="text-teal" /> {tour.mealsIncluded ? "Breakfast & dinner included daily" : "Meals not included"}
              </p>
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">Pickup & drop</h2>
              <p className="mt-2 text-sm text-ink/80">Airport / railway station pickup included on Day 1, drop on the final day.</p>
              <div className="mt-3 flex h-32 items-center justify-center rounded-xl border border-dashed border-line-strong bg-paper-soft text-xs text-slate">
                Google Maps preview
              </div>
            </div>
          </section>

          <hr className="my-8 border-line" />

          {/* Inclusions / Exclusions */}
          <section className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">What&apos;s included</h2>
              <ul className="mt-3 flex flex-col gap-2">
                {tour.inclusions.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[14px] text-ink/80">
                    <Check size={15} className="mt-0.5 shrink-0 text-teal" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">What&apos;s not included</h2>
              <ul className="mt-3 flex flex-col gap-2">
                {tour.exclusions.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[14px] text-ink/80">
                    <XIcon size={15} className="mt-0.5 shrink-0 text-danger" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <hr className="my-8 border-line" />

          {/* Things to carry */}
          <section>
            <h2 className="font-display text-lg font-semibold text-ink">Things to carry</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {tour.thingsToCarry.map((item) => (
                <span key={item} className="rounded-full border border-line px-3 py-1.5 text-xs text-ink/80">{item}</span>
              ))}
            </div>
          </section>

          <hr className="my-8 border-line" />

          {/* Cancellation policy */}
          <section>
            <h2 className="font-display text-lg font-semibold text-ink">Cancellation policy</h2>
            <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-line bg-paper-soft p-4 text-sm text-ink/80">
              <ShieldCheck size={18} className="mt-0.5 shrink-0 text-teal" />
              <p>
                {tour.freeCancellation
                  ? "Free cancellation up to 48 hours before departure for a full refund. Cancellations within 48 hours are non-refundable."
                  : "This tour has a strict cancellation policy due to non-refundable third-party bookings. Cancellations made 15+ days before departure receive a 50% refund."}
              </p>
            </div>
          </section>

          <hr className="my-8 border-line" />

          {/* Reviews */}
          <section>
            <h2 className="font-display text-xl font-semibold text-ink">Reviews</h2>
            <div className="mt-6">
              <ReviewsSection rating={tour.rating} reviewCount={tour.reviewCount} reviews={tour.reviews} />
            </div>
          </section>
        </div>

        {/* Booking panel */}
        <div>
          <BookingPanel tour={tour} source={source} apiTourDates={apiTourDates} />
        </div>
      </div>

      {related.length > 0 && (
        <div className="container-page mt-14">
          <h2 className="font-display text-xl font-semibold text-ink">You might also like</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((t) => <TourCard key={t.slug} tour={t} />)}
          </div>
        </div>
      )}
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lookup = await getTourForDetail(slug);
  if (!lookup) return {};
  return {
    title: `${lookup.tour.title} — ${formatINR(lookup.tour.price)} | Voyagr`,
    description: lookup.tour.highlights[0] ?? lookup.tour.title,
  };
}
