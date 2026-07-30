import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Heart, Scale, Clock3, Users, MapPin } from "lucide-react";
import type { Tour } from "@/types";
import { cn, discountPercent, formatINR } from "@/lib/utils";
import StarRating from "./star-rating";

export default function TourCard({
  tour,
  className,
  horizontal = false,
}: {
  tour: Tour;
  className?: string;
  horizontal?: boolean;
}) {
  const discount = discountPercent(tour.price, tour.originalPrice);

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-[var(--radius-lg)] border border-line bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_-20px_rgba(14,20,32,0.25)]",
        horizontal && "sm:flex-row sm:hover:-translate-y-0",
        className
      )}
    >
      <Link
        href={`/tours/${tour.slug}`}
        className={cn(
          "relative block aspect-[4/3] overflow-hidden bg-paper-dim",
          horizontal && "sm:aspect-auto sm:w-72 sm:shrink-0"
        )}
      >        <Image
          src={tour.image}
          alt={tour.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />

        {discount > 0 && (
          <span className="absolute top-3 left-3 rounded-full bg-gold px-2.5 py-1 text-[11px] font-semibold text-ink">
            {discount}% off
          </span>
        )}

        <div className="absolute top-3 right-3 flex gap-2">
          <button
            aria-label="Add to wishlist"
            className="grid h-8 w-8 place-items-center rounded-full glass-dark text-white transition-colors hover:text-gold"
          >
            <Heart size={15} />
          </button>
          <button
            aria-label="Add to compare"
            className="grid h-8 w-8 place-items-center rounded-full glass-dark text-white transition-colors hover:text-gold"
          >
            <Scale size={15} />
          </button>
        </div>

        {tour.seatsLeft <= 5 && (
          <span className="absolute bottom-3 left-3 rounded-full bg-danger/95 px-2.5 py-1 text-[11px] font-semibold text-white">
            Only {tour.seatsLeft} seats left
          </span>
        )}
      </Link>

      <div className={cn("flex flex-1 flex-col gap-3 p-4", horizontal && "sm:p-5")}>
        <div className="flex items-center gap-1.5 text-xs text-slate">
          <MapPin size={13} />
          <span>{tour.destination}, {tour.country}</span>
        </div>

        <Link href={`/tours/${tour.slug}`}>
          <h3 className="font-display text-[17px] font-semibold leading-snug text-ink line-clamp-2 transition-colors group-hover:text-teal">
            {tour.title}
          </h3>
        </Link>

        <div className="flex items-center gap-3 text-xs text-slate">
          <span className="inline-flex items-center gap-1"><Clock3 size={13} /> {tour.duration}</span>
          <span className="inline-flex items-center gap-1"><Users size={13} /> {tour.seatsLeft} seats</span>
        </div>

        <Link
          href={`/agencies/${tour.agency.slug}`}
          className="flex items-center gap-1.5 text-xs text-slate hover:text-ink"
        >
          <span className="relative h-4 w-4 overflow-hidden rounded-full bg-paper-dim">
            <Image src={tour.agency.logo} alt={tour.agency.name} fill className="object-cover" />
          </span>
          <span className="truncate">{tour.agency.name}</span>
          {tour.agency.verified && <BadgeCheck size={13} className="shrink-0 text-teal" />}
        </Link>

        <div className="mt-auto flex items-end justify-between border-t border-line pt-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-lg font-semibold text-ink">{formatINR(tour.price)}</span>
              {discount > 0 && (
                <span className="font-mono text-xs text-slate line-through">{formatINR(tour.originalPrice)}</span>
              )}
            </div>
            <span className="text-[11px] text-slate">per person</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <StarRating rating={tour.rating} size={12} showValue />
            <span className="text-[11px] text-slate">{tour.reviewCount} reviews</span>
          </div>
        </div>

        <Link
          href={`/tours/${tour.slug}`}
          className="mt-1 inline-flex items-center justify-center rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal"
        >
          View details
        </Link>
      </div>
    </div>
  );
}
