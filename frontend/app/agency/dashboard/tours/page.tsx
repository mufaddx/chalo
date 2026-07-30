"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Copy, PackagePlus, Pencil, Search, Trash2, Users,
} from "lucide-react";
import { agencyTours as mockAgencyTours } from "@/lib/agency-dashboard-data";
import { fetchAgencyTours, deleteAgencyTour, duplicateAgencyTour } from "@/lib/api/agency";
import type { ApiTourSummary } from "@/lib/api/types";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";
import ManageDatesModal from "@/components/agency-dashboard/manage-dates-modal";
import DeleteTourModal from "@/components/agency-dashboard/delete-tour-modal";
import { DemoDataBanner, LiveDataBanner } from "@/components/dashboard/data-source-banner";

const STATUS_STYLES: Record<string, string> = {
  published: "bg-teal-soft text-teal",
  pending_approval: "bg-gold-pale text-gold-deep",
  draft: "bg-paper-dim text-ink/60",
  rejected: "bg-danger/10 text-danger",
  closed: "bg-paper-dim text-slate",
};

export default function AgencyToursPage() {
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<"loading" | "live" | "offline">("loading");
  const [liveTours, setLiveTours] = useState<ApiTourSummary[]>([]);
  const [busySlug, setBusySlug] = useState<string | null>(null);

  const [datesModalSlug, setDatesModalSlug] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id?: number; slug: string; title: string } | null>(null);
  const [removedMock, setRemovedMock] = useState<string[]>([]);

  const loadLive = () => {
    fetchAgencyTours()
      .then((res) => {
        setLiveTours(res.data);
        setSource("live");
      })
      .catch(() => setSource("offline"));
  };

  useEffect(() => {
    loadLive();
  }, []);

  const usingLive = source === "live";

  const filteredLive = liveTours.filter((t) => t.title.toLowerCase().includes(query.toLowerCase()));
  const filteredMock = mockAgencyTours.filter((t) => !removedMock.includes(t.slug) && t.title.toLowerCase().includes(query.toLowerCase()));

  const duplicateLive = async (tour: ApiTourSummary) => {
    setBusySlug(tour.slug);
    try {
      await duplicateAgencyTour(tour.id);
      loadLive();
    } catch {
      // no-op
    } finally {
      setBusySlug(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    if (usingLive && deleteTarget.id) {
      setBusySlug(deleteTarget.slug);
      try {
        await deleteAgencyTour(deleteTarget.id);
        loadLive();
      } catch {
        // no-op
      } finally {
        setBusySlug(null);
      }
    } else {
      setRemovedMock((prev) => [...prev, deleteTarget.slug]);
    }
    setDeleteTarget(null);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Tours</h1>
          <p className="mt-1 text-sm text-slate">{usingLive ? filteredLive.length : filteredMock.length} tours</p>
        </div>
        <Link href="/agency/dashboard/tours/new" className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-teal">
          <PackagePlus size={15} /> Create tour
        </Link>
      </div>

      {source === "live" && <LiveDataBanner />}
      {source === "offline" && <DemoDataBanner reason="offline" />}

      <div className="relative mt-4 max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your tours..."
          className="h-11 w-full rounded-full border border-line bg-white pl-10 pr-4 text-sm focus:outline-none focus:border-ink"
        />
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {usingLive
          ? filteredLive.map((tour) => {
              return (
                <div key={tour.slug} className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-line bg-white p-4 sm:flex-row sm:items-center">
                  <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-paper-dim sm:h-20 sm:w-28">
                    {tour.cover_image && <Image src={tour.cover_image} alt={tour.title} fill className="object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-[15px] font-semibold text-ink">{tour.title}</p>
                      <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize", STATUS_STYLES.published)}>
                        Published
                      </span>
                    </div>
                    <p className="mt-1 text-[13px] text-slate">{tour.destination?.name} &middot; {tour.duration}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-ink/75">
                      <span className="font-mono">{formatINR(tour.price)}</span>
                      <span>{tour.review_count} reviews</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Link
                      href={`/agency/dashboard/tours/${tour.slug}/edit`}
                      className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-2 text-[12.5px] font-medium text-ink hover:border-ink"
                    >
                      <Pencil size={12} /> Edit
                    </Link>
                    <button
                      disabled={busySlug === tour.slug}
                      onClick={() => duplicateLive(tour)}
                      className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-2 text-[12.5px] font-medium text-ink hover:border-ink disabled:opacity-50"
                    >
                      <Copy size={12} /> Duplicate
                    </button>
                    <button
                      disabled={busySlug === tour.slug}
                      onClick={() => setDeleteTarget({ id: tour.id, slug: tour.slug, title: tour.title })}
                      className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-2 text-[12.5px] font-medium text-danger hover:bg-danger/5 disabled:opacity-50"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              );
            })
          : filteredMock.map((tour) => (
              <div key={tour.slug} className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-line bg-white p-4 sm:flex-row sm:items-center">
                <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl sm:h-20 sm:w-28">
                  <Image src={tour.image} alt={tour.title} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-[15px] font-semibold text-ink">{tour.title}</p>
                    <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize", STATUS_STYLES.published)}>
                      Published
                    </span>
                  </div>
                  <p className="mt-1 text-[13px] text-slate">{tour.destination} &middot; {tour.duration}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-ink/75">
                    <span className="font-mono">{formatINR(tour.price)}</span>
                    <span className="inline-flex items-center gap-1"><Users size={12} /> {tour.seatsLeft} seats left</span>
                    <span>{tour.reviewCount} reviews</span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <button
                    onClick={() => setDatesModalSlug(tour.slug)}
                    className="rounded-full border border-line px-3 py-2 text-[12.5px] font-medium text-ink hover:border-ink"
                  >
                    Manage dates
                  </button>
                  <Link
                    href={`/agency/dashboard/tours/${tour.slug}/edit`}
                    className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-2 text-[12.5px] font-medium text-ink hover:border-ink"
                  >
                    <Pencil size={12} /> Edit
                  </Link>
                  <button className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-2 text-[12.5px] font-medium text-ink hover:border-ink">
                    <Copy size={12} /> Duplicate
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ slug: tour.slug, title: tour.title })}
                    className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-2 text-[12.5px] font-medium text-danger hover:bg-danger/5"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            ))}
      </div>

      {datesModalSlug && (
        <ManageDatesModal
          tour={mockAgencyTours.find((t) => t.slug === datesModalSlug)!}
          onClose={() => setDatesModalSlug(null)}
        />
      )}

      {deleteTarget && (
        <DeleteTourModal
          tourTitle={deleteTarget.title}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
