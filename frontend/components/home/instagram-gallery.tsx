import Image from "next/image";
import { InstagramGlyph } from "@/components/shared/social-icons";

// Real, verified travel photos (same curated set used in lib/data.ts)
// instead of arbitrary random stock images.
const shots = [
  "https://images.unsplash.com/photo-1619837374214-f5b9eb80876d", // Ladakh
  "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2", // Goa
  "https://plus.unsplash.com/premium_photo-1697729438401-fcb4ff66d9a8", // Kerala
  "https://images.unsplash.com/photo-1555400038-63f5ba517a47", // Bali
  "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e", // Santorini
  "https://plus.unsplash.com/premium_photo-1661963054563-ce928e477ff3", // Rajasthan
];

export default function InstagramGallery() {
  return (
    <section className="border-t border-line py-16 sm:py-20">
      <div className="container-page">
        <div className="flex items-center justify-center gap-2">
          <InstagramGlyph size={16} className="text-gold-deep" />
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate">@voyagr.trips</span>
        </div>
        <h2 className="mt-2 text-center font-display text-[26px] font-semibold text-ink">Tag us in the moment</h2>
        <div className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
          {shots.map((s) => (
            <div key={s} className="group relative aspect-square overflow-hidden rounded-[var(--radius-md)]">
              <Image
                src={`${s}?fm=jpg&q=70&w=400&h=400&fit=crop&auto=format`}
                alt="Traveller photo shared on Instagram"
                fill
                sizes="200px"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
