import Image from "next/image";
import { InstagramGlyph } from "@/components/shared/social-icons";

const shots = ["ig-1", "ig-2", "ig-3", "ig-4", "ig-5", "ig-6"];

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
                src={`https://picsum.photos/seed/${s}/400/400`}
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
