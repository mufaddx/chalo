import { cn } from "@/lib/utils";

/**
 * The platform's signature motif: a dashed flight-path connecting two points,
 * echoing the destination coordinates used throughout the site. Reused at
 * hero scale and, rotated, as the connector between itinerary days.
 */
export default function RouteLine({
  className,
  vertical = false,
}: {
  className?: string;
  vertical?: boolean;
}) {
  if (vertical) {
    return (
      <svg
        width="2"
        height="100%"
        viewBox="0 0 2 100"
        preserveAspectRatio="none"
        className={cn("absolute", className)}
        aria-hidden
      >
        <line
          x1="1"
          y1="0"
          x2="1"
          y2="100"
          stroke="var(--line-strong)"
          strokeWidth="2"
          strokeDasharray="1 7"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 600 120"
      className={cn("w-full h-auto", className)}
      fill="none"
      aria-hidden
    >
      <path
        d="M10 100 C 150 20, 250 20, 300 60 S 470 100, 590 15"
        stroke="var(--gold)"
        strokeWidth="2"
        strokeDasharray="1 10"
        strokeLinecap="round"
        className="animate-dash"
        style={{ strokeDashoffset: 0 }}
      />
      <circle cx="10" cy="100" r="4" fill="var(--teal)" />
      <circle cx="590" cy="15" r="4" fill="var(--gold-deep)" />
    </svg>
  );
}
