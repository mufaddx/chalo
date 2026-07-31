import Link from "next/link";
import { Mail } from "lucide-react";

export default function PressPage() {
  return (
    <div className="container-page py-16 sm:py-20">
      <div className="max-w-xl">
        <span className="mb-2 inline-block font-mono text-[11px] uppercase tracking-[0.14em] text-gold-deep">Press</span>
        <h1 className="font-display text-[28px] font-semibold leading-tight text-ink sm:text-[34px]">Press &amp; media</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-slate">
          Voyagr is a marketplace comparing tours from verified Indian travel agencies with transparent pricing and a
          single consistent booking policy. For interview requests, brand assets, or any press inquiry, reach out
          through the contact form and we&apos;ll follow up directly.
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-teal"
        >
          <Mail size={15} /> Contact press team
        </Link>
      </div>
    </div>
  );
}
