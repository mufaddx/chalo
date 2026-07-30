import { BadgeCheck, RefreshCcw, Scale, ShieldCheck } from "lucide-react";

const PILLARS = [
  {
    icon: BadgeCheck,
    title: "Every agency verified",
    text: "Document checks plus a manual review of at least three completed tours before anyone can list.",
  },
  {
    icon: Scale,
    title: "Real side-by-side comparison",
    text: "Same destination, different agencies — price, hotel rating and inclusions lined up honestly.",
  },
  {
    icon: ShieldCheck,
    title: "One booking policy",
    text: "Pay through Voyagr, not the agency, so refunds and cancellations follow one consistent standard.",
  },
  {
    icon: RefreshCcw,
    title: "Cancelled? You're covered",
    text: "If an agency cancels a confirmed trip, you get a full refund or a free transfer automatically.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-teal py-16 text-white sm:py-20">
      <div className="container-page">
        <div className="max-w-xl">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/60">Why Voyagr</span>
          <h2 className="mt-2 font-display text-[28px] font-semibold leading-tight sm:text-[34px]">
            Booking a tour shouldn&apos;t require forty WhatsApp messages
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <div key={p.title} className="rounded-[var(--radius-lg)] border border-white/15 bg-white/[0.04] p-6">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gold text-ink">
                <p.icon size={18} />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold">{p.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-white/60">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
