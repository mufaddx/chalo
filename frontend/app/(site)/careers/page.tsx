import Link from "next/link";
import { Mail } from "lucide-react";

export default function CareersPage() {
  return (
    <div className="container-page py-16 sm:py-20">
      <div className="max-w-xl">
        <span className="mb-2 inline-block font-mono text-[11px] uppercase tracking-[0.14em] text-gold-deep">Careers</span>
        <h1 className="font-display text-[28px] font-semibold leading-tight text-ink sm:text-[34px]">Join Voyagr</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-slate">
          We&apos;re not hiring for any specific role right now. If you&apos;d still like to introduce yourself, reach
          out through the contact form with a short note about what you do — we keep good introductions on file for
          when a relevant opening comes up.
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-teal"
        >
          <Mail size={15} /> Get in touch
        </Link>
      </div>
    </div>
  );
}
