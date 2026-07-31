import Image from "next/image";
import { notFound } from "next/navigation";
import { BadgeCheck, Globe, Mail, MapPin, Phone } from "lucide-react";
import { agencies, getAgencyBySlug, getToursByAgency } from "@/lib/data";
import { getAgencyForProfile } from "@/lib/api/get-agency";
import StarRating from "@/components/shared/star-rating";
import TourCard from "@/components/shared/tour-card";
import ReviewsSection from "@/components/tour/reviews-section";
import { DemoDataBanner, LiveDataBanner } from "@/components/dashboard/data-source-banner";

export function generateStaticParams() {
  return agencies.map((a) => ({ slug: a.slug }));
}

export default async function AgencyProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lookup = await getAgencyForProfile(slug);
  if (!lookup) notFound();
  const { agency, tours: agencyTours, source } = lookup;

  // Full review objects (text, author, images) only exist in the mock data —
  // the live tours endpoint returns summaries without them. Showing partial,
  // fabricated-looking reviews on live data would be worse than omitting the
  // section, so it only renders in demo mode.
  const allReviews = source === "demo" ? getToursByAgency(slug).flatMap((t) => t.reviews) : [];

  const stats = [
    { label: "Years experience", value: `${agency.yearsExperience}+` },
    { label: "Active tours", value: source === "live" ? agencyTours.length : agency.totalTours },
    { label: "Followers", value: agency.followersCount.toLocaleString("en-IN") },
    { label: "Rating", value: agency.rating.toFixed(1) },
  ];

  return (
    <div className="pb-20">
      <div className="relative h-56 w-full overflow-hidden sm:h-72">
        <Image src={agency.cover} alt={`${agency.name} cover`} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
      </div>

      <div className="container-page">
        {source === "live" && <LiveDataBanner />}
        {source === "demo" && <DemoDataBanner reason="offline" />}

        <div className="relative -mt-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-[var(--radius-lg)] border-4 border-paper bg-white shadow-lg">
              <Image src={agency.logo} alt={agency.name} fill className="object-cover" />
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-1.5">
                <h1 className="font-display text-2xl font-semibold text-ink">{agency.name}</h1>
                {agency.verified && <BadgeCheck size={18} className="text-teal" />}
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate">
                <MapPin size={14} /> {agency.city}
              </p>
            </div>
          </div>
          <div className="flex gap-2 pb-1">
            <a href={`tel:${agency.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2.5 text-sm font-medium text-ink hover:border-ink">
              <Phone size={15} /> Call
            </a>
            <a href={`mailto:${agency.email}`} className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-teal">
              <Mail size={15} /> Email agency
            </a>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-[var(--radius-md)] border border-line bg-white p-4 text-center">
              <span className="font-display text-2xl font-semibold text-ink">{s.value}</span>
              <p className="mt-1 text-[11.5px] text-slate">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0">
            <section>
              <h2 className="font-display text-xl font-semibold text-ink">About {agency.name}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-slate">{agency.about}</p>
            </section>

            <hr className="my-8 border-line" />

            <section>
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold text-ink">Active tours ({agencyTours.length})</h2>
              </div>
              {agencyTours.length === 0 ? (
                <p className="mt-6 text-sm text-slate">This agency doesn&apos;t have any published tours yet.</p>
              ) : (
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {agencyTours.map((t) => <TourCard key={t.slug} tour={t} />)}
                </div>
              )}
            </section>

            {allReviews.length > 0 && (
              <>
                <hr className="my-8 border-line" />
                <section>
                  <h2 className="font-display text-xl font-semibold text-ink">Customer reviews</h2>
                  <div className="mt-6">
                    <ReviewsSection rating={agency.rating} reviewCount={agency.reviewCount} reviews={allReviews} />
                  </div>
                </section>
              </>
            )}
          </div>

          <aside className="flex flex-col gap-4">
            <div className="rounded-[var(--radius-lg)] border border-line bg-white p-5">
              <h3 className="font-display text-base font-semibold text-ink">Contact details</h3>
              <div className="mt-4 flex flex-col gap-3 text-sm">
                <span className="flex items-center gap-2.5 text-ink/80"><MapPin size={15} className="text-teal" /> {agency.city}</span>
                <span className="flex items-center gap-2.5 text-ink/80"><Phone size={15} className="text-teal" /> {agency.phone}</span>
                <span className="flex items-center gap-2.5 text-ink/80"><Mail size={15} className="text-teal" /> {agency.email}</span>
                <span className="flex items-center gap-2.5 text-ink/80"><Globe size={15} className="text-teal" /> {agency.website}</span>
              </div>
              <div className="mt-4 flex h-28 items-center justify-center rounded-xl border border-dashed border-line-strong bg-paper-soft text-xs text-slate">
                Google Maps preview
              </div>
            </div>

            <div className="rounded-[var(--radius-lg)] border border-line bg-paper-soft p-5">
              <StarRating rating={agency.rating} size={14} showValue />
              <p className="mt-1 text-xs text-slate">{agency.reviewCount} verified reviews</p>
              <p className="mt-3 text-[13px] leading-relaxed text-ink/70">
                Verified by Voyagr&apos;s document and past-trip review process on {agency.yearsExperience > 10 ? "an agency with over a decade" : "a growing agency with a strong track record"} of operating history.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const agency = getAgencyBySlug(slug);
  if (!agency) return {};
  return {
    title: `${agency.name} — Verified Travel Agency | Voyagr`,
    description: agency.about,
  };
}
