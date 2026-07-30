import { testimonials } from "@/lib/data";
import SectionHeading from "@/components/shared/section-heading";
import StarRating from "@/components/shared/star-rating";
import { Quote } from "lucide-react";

export default function Testimonials() {
  return (
    <section className="container-page py-16 sm:py-20">
      <SectionHeading eyebrow="From real travellers" title="Customer reviews" align="center" />
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {testimonials.map((t) => (
          <figure key={t.author} className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-line bg-white p-6">
            <Quote size={22} className="text-gold" />
            <StarRating rating={t.rating} size={13} />
            <blockquote className="text-[14.5px] leading-relaxed text-ink/85">&ldquo;{t.text}&rdquo;</blockquote>
            <figcaption className="mt-auto text-sm">
              <span className="font-medium text-ink">{t.author}</span>
              <span className="text-slate"> · {t.location}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
