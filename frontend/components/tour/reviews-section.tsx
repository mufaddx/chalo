import Image from "next/image";
import type { Review } from "@/types";
import StarRating from "@/components/shared/star-rating";

export default function ReviewsSection({ rating, reviewCount, reviews }: { rating: number; reviewCount: number; reviews: Review[] }) {
  const breakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    return { star, pct: reviews.length ? Math.round((count / reviews.length) * 100) : 0 };
  });

  return (
    <div>
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
        <div className="flex shrink-0 flex-col items-center rounded-[var(--radius-lg)] border border-line bg-paper-soft px-8 py-6">
          <span className="font-display text-4xl font-semibold text-ink">{rating.toFixed(1)}</span>
          <StarRating rating={rating} size={15} className="mt-1" />
          <span className="mt-1 text-xs text-slate">{reviewCount} verified reviews</span>
        </div>
        <div className="flex-1 space-y-1.5">
          {breakdown.map((b) => (
            <div key={b.star} className="flex items-center gap-2 text-xs text-slate">
              <span className="w-10">{b.star} star</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper-dim">
                <div className="h-full rounded-full bg-gold" style={{ width: `${b.pct}%` }} />
              </div>
              <span className="w-8 text-right">{b.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col divide-y divide-line">
        {reviews.map((r) => (
          <div key={r.id} className="py-6 first:pt-0">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-display text-sm font-semibold text-ink">{r.author}</span>
                <div className="mt-1 flex items-center gap-2">
                  <StarRating rating={r.rating} size={12} />
                  <span className="text-xs text-slate">{r.date}</span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink/80">{r.text}</p>
            {r.images && r.images.length > 0 && (
              <div className="mt-3 flex gap-2">
                {r.images.map((img, i) => (
                  <div key={i} className="relative h-16 w-20 overflow-hidden rounded-lg">
                    <Image src={img} alt="Review photo" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
            {r.agencyReply && (
              <div className="mt-3 rounded-xl bg-paper-soft px-4 py-3">
                <span className="text-xs font-semibold text-teal">Agency reply</span>
                <p className="mt-1 text-[13.5px] leading-relaxed text-ink/70">{r.agencyReply}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
