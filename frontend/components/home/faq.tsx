"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { faqs } from "@/lib/data";
import SectionHeading from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-paper-soft py-16 sm:py-20">
      <div className="container-page max-w-3xl">
        <SectionHeading eyebrow="Good to know" title="Frequently asked questions" align="center" />
        <div className="mt-8 flex flex-col divide-y divide-line rounded-[var(--radius-lg)] border border-line bg-white">
          {faqs.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={open}
                >
                  <span className="font-display text-[15.5px] font-medium text-ink">{item.q}</span>
                  <Plus size={18} className={cn("shrink-0 text-slate transition-transform duration-300", open && "rotate-45 text-gold-deep")} />
                </button>
                <div
                  className={cn(
                    "grid overflow-hidden px-6 text-[14.5px] leading-relaxed text-slate transition-all duration-300",
                    open ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">{item.a}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
