"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Scale, X } from "lucide-react";
import { tours } from "@/lib/data";
import { compareTourSlugs as initialSlugs } from "@/lib/dashboard-data";
import { formatINR } from "@/lib/utils";
import StarRating from "@/components/shared/star-rating";

const ROWS: { label: string; render: (t: (typeof tours)[number]) => React.ReactNode }[] = [
  { label: "Price", render: (t) => <span className="font-mono font-semibold text-ink">{formatINR(t.price)}</span> },
  { label: "Duration", render: (t) => t.duration },
  { label: "Hotel rating", render: (t) => `${t.hotelRating}★` },
  { label: "Transport", render: (t) => t.transport.join(", ") },
  { label: "Meals included", render: (t) => (t.mealsIncluded ? "Yes" : "No") },
  { label: "Free cancellation", render: (t) => (t.freeCancellation ? "Yes" : "No") },
  { label: "Rating", render: (t) => <StarRating rating={t.rating} size={13} showValue /> },
  { label: "Agency", render: (t) => t.agency.name },
  { label: "Seats left", render: (t) => t.seatsLeft },
];

export default function ComparePage() {
  const [slugs, setSlugs] = useState<string[]>(initialSlugs);
  const items = tours.filter((t) => slugs.includes(t.slug));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Compare Tours</h1>
      <p className="mt-1 text-sm text-slate">Line up price, duration and inclusions across agencies before you book.</p>

      {items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-2 py-16 text-center">
          <Scale size={28} className="text-slate-soft" />
          <h3 className="font-display text-lg font-semibold text-ink">Nothing to compare yet</h3>
          <p className="text-sm text-slate">Add tours to comparison from any tour card while browsing.</p>
          <Link href="/search" className="mt-3 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white">
            Browse tours
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="w-32"></th>
                {items.map((t) => (
                  <th key={t.slug} className="rounded-t-[var(--radius-md)] border border-line bg-white p-4 text-left align-top">
                    <div className="relative flex justify-end">
                      <button
                        onClick={() => setSlugs((s) => s.filter((x) => x !== t.slug))}
                        aria-label="Remove from comparison"
                        className="absolute -top-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-paper-soft text-slate hover:text-danger"
                      >
                        <X size={13} />
                      </button>
                    </div>
                    <div className="relative mb-2 aspect-[4/3] w-full overflow-hidden rounded-lg">
                      <Image src={t.image} alt={t.title} fill className="object-cover" />
                    </div>
                    <Link href={`/tours/${t.slug}`} className="font-display text-[14px] font-semibold text-ink hover:text-teal line-clamp-2">
                      {t.title}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr key={row.label}>
                  <td className="border-x border-line bg-paper-soft px-4 py-3 text-[13px] font-medium text-slate">{row.label}</td>
                  {items.map((t) => (
                    <td key={t.slug} className="border-x border-t border-line bg-white px-4 py-3 text-[13.5px] text-ink/85">
                      {row.render(t)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="rounded-bl-[var(--radius-md)] border border-line bg-paper-soft px-4 py-4"></td>
                {items.map((t) => (
                  <td key={t.slug} className="border-x border-b border-line bg-white px-4 py-4 last:rounded-br-[var(--radius-md)]">
                    <Link href={`/tours/${t.slug}`} className="block rounded-full bg-ink py-2.5 text-center text-xs font-medium text-white hover:bg-teal">
                      View & book
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
