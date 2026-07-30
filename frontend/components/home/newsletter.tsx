import { ArrowRight, Mail } from "lucide-react";
import RouteLine from "@/components/shared/route-line";

export default function Newsletter() {
  return (
    <section className="relative overflow-hidden bg-ink py-16 text-white sm:py-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 opacity-30">
        <RouteLine />
      </div>
      <div className="container-page relative flex flex-col items-center text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-gold text-ink">
          <Mail size={20} />
        </span>
        <h2 className="mt-5 font-display text-[26px] font-semibold sm:text-[32px]">
          Fares drop quietly. We&apos;ll tell you when they do.
        </h2>
        <p className="mt-2 max-w-md text-[14.5px] text-white/60">
          One email a week — new verified agencies, genuine price drops, and
          the last-minute departures worth rearranging your calendar for.
        </p>
        <form className="mt-6 flex w-full max-w-md flex-col gap-2 sm:flex-row">
          <input
            type="email"
            required
            placeholder="you@email.com"
            className="h-12 flex-1 rounded-full border border-white/15 bg-white/[0.06] px-5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold"
          />
          <button className="inline-flex h-12 items-center justify-center gap-1.5 rounded-full bg-gold px-6 text-sm font-semibold text-ink transition-colors hover:bg-gold-deep">
            Subscribe <ArrowRight size={15} />
          </button>
        </form>
        <span className="mt-3 text-[11px] text-white/35">No spam. Unsubscribe in one click.</span>
      </div>
    </section>
  );
}
