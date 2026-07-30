import type { Tour } from "@/types";
import TourCard from "@/components/shared/tour-card";
import SectionHeading from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";

export default function TourRail({
  eyebrow,
  title,
  description,
  tours,
  tone = "light",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  tours: Tour[];
  tone?: "light" | "dark";
}) {
  return (
    <section className={cn("py-16 sm:py-20", tone === "dark" && "bg-ink text-white")}>
      <div className="container-page">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          href="/search"
          className={tone === "dark" ? "[&_h2]:text-white [&_a]:text-white [&_p]:text-white/60" : undefined}
        />
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tours.map((tour) => (
            <TourCard key={tour.slug} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
}
