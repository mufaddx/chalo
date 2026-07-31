import Link from "next/link";
import { ArrowRight, LifeBuoy, MessageCircle } from "lucide-react";

const FAQS = [
  {
    q: "How do I check the status of my booking?",
    a: "Sign in and open My Bookings from your dashboard — every booking shows its live status (pending, confirmed, cancelled) and payment state.",
  },
  {
    q: "Can I cancel or reschedule a booking?",
    a: "Open the booking from My Bookings and use the cancel option there. Cancellation terms vary by tour and are shown on the tour's own page before you book.",
  },
  {
    q: "I paid but my booking still shows pending — what happened?",
    a: "Payment confirmation can take a few minutes to sync. If it's still pending after 15 minutes, raise a ticket from your dashboard with your booking ID and we'll check it manually.",
  },
  {
    q: "How do I list my travel agency on Voyagr?",
    a: "Head over to the agency registration page — you'll need a GST certificate, PAN card, or trade license to get verified.",
  },
];

export default function SupportPage() {
  return (
    <div className="container-page py-16 sm:py-20">
      <div className="max-w-xl">
        <span className="mb-2 inline-block font-mono text-[11px] uppercase tracking-[0.14em] text-gold-deep">Help centre</span>
        <h1 className="font-display text-[28px] font-semibold leading-tight text-ink sm:text-[34px]">How can we help?</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-slate">
          Answers to common questions below. For anything about an existing booking or payment, signing in gets you the
          fastest, most specific reply since we can see your booking directly.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Link
          href="/login?next=/dashboard/support"
          className="flex items-start gap-4 rounded-[var(--radius-lg)] border border-line bg-white p-6 transition-colors hover:border-ink"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-paper-soft text-teal"><LifeBuoy size={20} /></span>
          <div>
            <h2 className="font-display text-base font-semibold text-ink">Raise a support ticket</h2>
            <p className="mt-1 text-sm text-slate">For booking, payment, or agency issues — sign in to track a ticket tied to your account.</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-ink">Sign in <ArrowRight size={14} /></span>
          </div>
        </Link>

        <Link
          href="/contact"
          className="flex items-start gap-4 rounded-[var(--radius-lg)] border border-line bg-white p-6 transition-colors hover:border-ink"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-paper-soft text-teal"><MessageCircle size={20} /></span>
          <div>
            <h2 className="font-display text-base font-semibold text-ink">Contact us</h2>
            <p className="mt-1 text-sm text-slate">General questions, partnerships, or anything else — no account needed.</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-ink">Send a message <ArrowRight size={14} /></span>
          </div>
        </Link>
      </div>

      <div className="mt-14">
        <h2 className="font-display text-xl font-semibold text-ink">Frequently asked questions</h2>
        <div className="mt-6 flex flex-col divide-y divide-line rounded-[var(--radius-lg)] border border-line bg-white">
          {FAQS.map((item) => (
            <div key={item.q} className="p-5">
              <h3 className="font-medium text-ink">{item.q}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
