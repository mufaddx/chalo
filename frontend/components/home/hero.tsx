import RouteLine from "@/components/shared/route-line";
import SearchBar from "@/components/home/search-bar";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-teal blur-3xl animate-drift" />
        <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-gold/20 blur-3xl animate-drift" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="container-page relative pt-20 pb-16 sm:pt-28 sm:pb-24">
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
