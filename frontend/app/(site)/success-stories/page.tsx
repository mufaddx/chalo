import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";

export default function SuccessStoriesPage() {
  return (
    <div className="container-page py-16 sm:py-20">
      <div className="max-w-xl">
        <span className="mb-2 inline-block font-mono text-[11px] uppercase tracking-[0.14em] text-gold-deep">Agency success stories</span>
        <h1 className="font-display text-[28px] font-semibold leading-tight text-ink sm:text-[34px]">
          Growing with Voyagr
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-slate">
          We feature real agencies who&apos;ve grown their bookings through Voyagr here — we&apos;re still building
          up that track record as more agencies come on board. If you run a verified agency and have a story worth
          sharing, we&apos;d love to hear it.
        </p>
      </div>

      <div className="mt-10 flex flex-col items-center gap-4 rounded-[var(--radius-lg)] border border-dashed border-line-strong bg-paper-soft py-16 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-teal"><TrendingUp size={22} /></span>
        <p className="max-w-sm text-sm text-slate">No stories published yet — check back as our agency network grows.</p>
        <Link href="/agency/register" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-teal">
          List your agency <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
