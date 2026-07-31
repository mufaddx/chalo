import { CheckCircle2, ShieldCheck, Users } from "lucide-react";

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "Verified agencies only",
    text: "Every agency on Voyagr goes through a document check — GST certificate, PAN, or trade license — before a single tour goes live.",
  },
  {
    icon: CheckCircle2,
    title: "Transparent pricing",
    text: "The price you see is the price you pay. No hidden markups layered on top by a middleman.",
  },
  {
    icon: Users,
    title: "One booking policy",
    text: "Cancellation, payment, and support work the same way no matter which agency you book with.",
  },
];

export default function AboutPage() {
  return (
    <div className="container-page py-16 sm:py-20">
      <div className="max-w-2xl">
        <span className="mb-2 inline-block font-mono text-[11px] uppercase tracking-[0.14em] text-gold-deep">About Voyagr</span>
        <h1 className="font-display text-[28px] font-semibold leading-tight text-ink sm:text-[34px]">
          One search across India&apos;s verified travel agencies
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-slate">
          Voyagr compares tours from verified travel agencies in one place, with transparent pricing and no middleman
          markup. Instead of messaging a dozen agencies separately and comparing screenshots, you search once, see
          real itineraries side by side, and book directly with the agency that fits — all under one consistent
          booking and cancellation policy.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {PRINCIPLES.map((p) => (
          <div key={p.title} className="rounded-[var(--radius-lg)] border border-line bg-white p-6">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-paper-soft text-teal">
              <p.icon size={20} />
            </span>
            <h2 className="mt-4 font-display text-base font-semibold text-ink">{p.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate">{p.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
