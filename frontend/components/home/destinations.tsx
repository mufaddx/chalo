import Image from "next/image";
import Link from "next/link";
import { destinations } from "@/lib/data";
import SectionHeading from "@/components/shared/section-heading";

export default function Destinations() {
  return (
    <section className="bg-paper-soft py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Where travellers are headed"
          title="Popular destinations"
          href="/search"
        />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {destinations.map((d, i) => (
            <Link
              key={d.name}
              href={`/search?q=${encodeURIComponent(d.name)}`}
              className={`group relative overflow-hidden rounded-[var(--radius-lg)] ${i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-[4/5]"}`}
            >
              <Image
                src={d.image}
                alt={d.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <span className="font-mono text-[10px] text-white/60">{d.coordinates}</span>
                <h3 className="font-display text-lg font-semibold text-white">{d.name}</h3>
                <span className="text-xs text-white/70">{d.tourCount} tours available</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
