"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Trash2 } from "lucide-react";
import { tours } from "@/lib/data";
import { wishlistTourSlugs as initialSlugs } from "@/lib/dashboard-data";
import { formatINR } from "@/lib/utils";
import StarRating from "@/components/shared/star-rating";

export default function WishlistPage() {
  const [slugs, setSlugs] = useState<string[]>(initialSlugs);
  const items = tours.filter((t) => slugs.includes(t.slug));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">Wishlist</h1>
        <span className="text-sm text-slate">{items.length} saved</span>
      </div>

      {items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-2 py-16 text-center">
          <Heart size={28} className="text-slate-soft" />
          <h3 className="font-display text-lg font-semibold text-ink">Nothing saved yet</h3>
          <p className="text-sm text-slate">Tap the heart icon on any tour to save it here for later.</p>
          <Link href="/search" className="mt-3 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white">
            Browse tours
          </Link>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((tour) => (
            <div key={tour.slug} className="overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white">
              <div className="relative aspect-[4/3]">
                <Link href={`/tours/${tour.slug}`}>
                  <Image src={tour.image} alt={tour.title} fill className="object-cover" />
                </Link>
                <button
                  onClick={() => setSlugs((s) => s.filter((x) => x !== tour.slug))}
                  aria-label="Remove from wishlist"
                  className="absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full glass-dark text-white hover:text-danger"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="p-4">
                <span className="flex items-center gap-1 text-xs text-slate"><MapPin size={12} /> {tour.destination}</span>
                <Link href={`/tours/${tour.slug}`} className="mt-1 block font-display text-[15px] font-semibold text-ink hover:text-teal">
                  {tour.title}
                </Link>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-mono text-base font-semibold text-ink">{formatINR(tour.price)}</span>
                  <StarRating rating={tour.rating} size={12} showValue />
                </div>
                <Link
                  href={`/tours/${tour.slug}`}
                  className="mt-3 block w-full rounded-full bg-ink py-2.5 text-center text-sm font-medium text-white hover:bg-teal"
                >
                  Book now
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
