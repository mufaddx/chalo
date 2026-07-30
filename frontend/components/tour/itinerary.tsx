"use client";

import { useState } from "react";
import { BedDouble, ChevronDown, Utensils } from "lucide-react";
import type { ItineraryDay } from "@/types";
import { cn } from "@/lib/utils";

export default function Itinerary({ days }: { days: ItineraryDay[] }) {
  const [open, setOpen] = useState<number>(1);

  return (
    <div className="relative">
      {days.map((d) => {
        const isOpen = open === d.day;
        return (
          <div key={d.day} className="relative flex gap-4 pb-6 last:pb-0">
            <div className="relative flex shrink-0 flex-col items-center">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink font-mono text-[12px] font-semibold text-gold">
                {String(d.day).padStart(2, "0")}
              </span>
              {d.day !== days.length && (
                <span className="mt-1 w-px flex-1 border-l-2 border-dashed border-line-strong" />
              )}
            </div>

            <div className="flex-1 pb-1">
              <button
                onClick={() => setOpen(isOpen ? 0 : d.day)}
                className="flex w-full items-start justify-between gap-3 text-left"
              >
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wide text-gold-deep">Day {d.day}</span>
                  <h3 className="font-display text-[16px] font-semibold text-ink">{d.title}</h3>
                </div>
                <ChevronDown size={18} className={cn("mt-1 shrink-0 text-slate transition-transform", isOpen && "rotate-180")} />
              </button>

              <div className={cn("grid overflow-hidden transition-all duration-300", isOpen ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0")}>
                <div className="overflow-hidden">
                  <p className="text-[14px] leading-relaxed text-slate">{d.description}</p>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-ink/70">
                    {d.meals.length > 0 && (
                      <span className="inline-flex items-center gap-1.5">
                        <Utensils size={13} className="text-teal" /> {d.meals.join(", ")}
                      </span>
                    )}
                    {d.stay && (
                      <span className="inline-flex items-center gap-1.5">
                        <BedDouble size={13} className="text-teal" /> {d.stay}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
