import Image from "next/image";
import RouteLine from "@/components/shared/route-line";
import SearchBar from "@/components/home/search-bar";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <Image
        src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?fm=jpg&q=80&w=2000&auto=format&fit=crop"
        alt="The Taj Mahal, India"
        fill
        priority
        className="object-cover"
      />
      {/* Darkens the photo enough for white text to stay readable (WCAG contrast) */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/70" />

      <div className="container-page relative pt-8 pb-16 sm:pt-12 sm:pb-24">
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

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-white/50">
          <span className="font-mono">34.15°N — Ladakh</span>
          <span className="font-mono">15.29°N — Goa</span>
          <span className="font-mono">36.39°N — Santorini</span>
          <span className="font-mono">46.55°N — Swiss Alps</span>
        </div>
      </div>
    </section>
  );
}
