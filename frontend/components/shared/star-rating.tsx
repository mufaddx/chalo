import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StarRating({
  rating,
  size = 14,
  showValue = false,
  className,
}: {
  rating: number;
  size?: number;
  showValue?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="inline-flex items-center gap-0.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = rating >= i + 1;
          const half = !filled && rating > i && rating < i + 1;
          return (
            <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
              <Star size={size} className="absolute inset-0 text-line-strong" fill="var(--line-strong)" strokeWidth={0} />
              {(filled || half) && (
                <span className="absolute inset-0 overflow-hidden" style={{ width: half ? "50%" : "100%" }}>
                  <Star size={size} className="text-gold" fill="var(--gold)" strokeWidth={0} />
                </span>
              )}
            </span>
          );
        })}
      </span>
      {showValue && <span className="text-sm font-medium text-ink">{rating.toFixed(1)}</span>}
      <span className="sr-only">{rating} out of 5 stars</span>
    </span>
  );
}
