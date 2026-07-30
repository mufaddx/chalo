import Image from "next/image";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { agencies } from "@/lib/data";
import SectionHeading from "@/components/shared/section-heading";
import StarRating from "@/components/shared/star-rating";

export default function TopAgencies() {
  return (
    <section className="container-page py-16 sm:py-20">
      <SectionHeading
        eyebrow="Who you're booking with"
        title="Top-rated travel agencies"
        description="Every agency here has passed document verification and a manual review of past trips."
        href="/search"
        hrefLabel="Browse all agencies"
      />
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {agencies.map((a) => (
          <Link
            key={a.slug}
            href={`/agencies/${a.slug}`}
            className="group flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-line bg-white p-6 text-center transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-22px_rgba(14,20,32,0.25)]"
          >
            <div className="relative h-16 w-16 overflow-hidden rounded-full border border-line bg-paper-soft">
              <Image src={a.logo} alt={a.name} fill className="object-cover" />
            </div>
            <div>
              <div className="flex items-center justify-center gap-1">
                <h3 className="font-display text-[15px] font-semibold text-ink">{a.name}</h3>
                {a.verified && <BadgeCheck size={14} className="text-teal" />}
              </div>
              <p className="mt-0.5 text-xs text-slate">{a.city}</p>
            </div>
            <StarRating rating={a.rating} size={12} showValue />
            <span className="text-[11px] text-slate">{a.totalTours} active tours</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
