import Image from "next/image";
import RouteLine from "@/components/shared/route-line";
import SearchBar from "@/components/home/search-bar";

// Same curated, verified-to-load real photos used across lib/data.ts.
const DESTINATION_STRIP = [
  { name: "Ladakh", coords: "34.15°N", href: "/search", photo: "https://images.unsplash.com/photo-1619837374214-f5b9eb80876d" },
  { name: "Goa", coords: "15.29°N", href: "/search", photo: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2" },
  { name: "Santorini", coords: "36.39°N", href: "/search", photo: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e" },
  { name: "Swiss Alps", coords: "46.55°N", href: "/search", photo: "https://images.unsplash.com/photo-1586752488885-6ce47fdfd874" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-teal blur-3xl animate-drift" />
        <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-gold/20 blur-3xl animate-drift" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="container-page relative pt-8 pb-16 sm:pt-12 sm:pb-20">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 font-mono text-[11px] tracking-wide text-white/70">
            212 verified agencies · 3,400+ tours live
          </span>

          <h1 className="mt-6 font-display text-[40px] font-semibold leading-[1.08] tracking-tight sm:text-[58px]">
            Every tour worth taking,
            <br />
            <span className="text-gold">compared honestly.</span>
          </h1>

          <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-white/65 sm:text-[17px]">
            Search once across hundreds of verified travel agencies. See the same
            trip priced three different ways, pick what actually fits, and book
            with one consistent cancellation policy.
          </p>
        </div>

        <div className="mt-10 hidden sm:block">
          <RouteLine className="max-w-md opacity-70" />
        </div>

        <div className="relative mt-4 sm:-mt-6">
          <SearchBar />
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {DESTINATION_STRIP.map((d) => (
            <a
              key={d.name}
              href={d.href}
              className="group relative aspect-[4/3] overflow-hidden rounded-[var(--radius-md)]"
            >
              <Image
                src={`${d.photo}?fm=jpg&q=70&w=500&h=375&fit=crop&auto=format`}
                alt={d.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2.5 right-2.5">
                <p className="font-mono text-[10px] text-white/70">{d.coords}</p>
                <p className="font-display text-[13px] font-semibold text-white">{d.name}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
