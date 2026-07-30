"use client";

import { useEffect, useState } from "react";
import { Check, ExternalLink, Star, X } from "lucide-react";
import { tours as mockTours } from "@/lib/data";
import { pendingTours as mockPendingTours, type PendingTour } from "@/lib/admin-data";
import { fetchAdminTours, approveTour, rejectTour, toggleTourFeatured } from "@/lib/api/admin";
import type { ApiTourDetail } from "@/lib/api/types";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { DemoDataBanner, LiveDataBanner } from "@/components/dashboard/data-source-banner";

export default function AdminToursPage() {
  const [source, setSource] = useState<"loading" | "live" | "offline">("loading");
  const [livePending, setLivePending] = useState<ApiTourDetail[]>([]);
  const [livePublished, setLivePublished] = useState<ApiTourDetail[]>([]);
  const [busyId, setBusyId] = useState<number | null>(null);

  const [mockPending, setMockPending] = useState<PendingTour[]>(mockPendingTours);
  const [rejectTarget, setRejectTarget] = useState<{ id?: number; slug?: string; title: string } | null>(null);
  const [mockFeatured, setMockFeatured] = useState<string[]>(mockTours.filter((t) => t.featured).map((t) => t.slug));

  const loadLive = () => {
    Promise.all([fetchAdminTours("pending_approval"), fetchAdminTours("published")])
      .then(([pendingRes, publishedRes]) => {
        setLivePending(pendingRes.data);
        setLivePublished(publishedRes.data);
        setSource("live");
      })
      .catch(() => setSource("offline"));
  };

  useEffect(() => {
    loadLive();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const usingLive = source === "live";

  const approveLive = async (tour: ApiTourDetail) => {
    setBusyId(tour.id);
    try {
      await approveTour(tour.id);
      loadLive();
    } catch {
      // no-op
    } finally {
      setBusyId(null);
    }
  };

  const rejectConfirm = async (reason: string) => {
    if (!rejectTarget) return;
    if (usingLive && rejectTarget.id) {
      setBusyId(rejectTarget.id);
      try {
        await rejectTour(rejectTarget.id, reason);
        loadLive();
      } catch {
        // no-op
      } finally {
        setBusyId(null);
      }
    } else if (rejectTarget.slug) {
      setMockPending((prev) => prev.filter((t) => t.id !== rejectTarget.slug));
    }
    setRejectTarget(null);
  };

  const toggleFeaturedLive = async (tour: ApiTourDetail) => {
    setBusyId(tour.id);
    try {
      await toggleTourFeatured(tour.id);
      loadLive();
    } catch {
      // no-op
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Tours</h1>
        <p className="mt-1 text-sm text-slate">Every new tour — and every edit to a live one — is reviewed here before it's public.</p>
      </div>

      {source === "live" && <LiveDataBanner />}
      {source === "offline" && <DemoDataBanner reason="offline" />}

      <section>
        <h2 className="font-display text-base font-semibold text-ink">
          Pending approval ({usingLive ? livePending.length : mockPending.length})
        </h2>
        <div className="mt-3 flex flex-col gap-3">
          {usingLive ? (
            <>
              {livePending.length === 0 && (
                <p className="rounded-[var(--radius-lg)] border border-line bg-white p-6 text-center text-sm text-slate">Nothing waiting for review.</p>
              )}
              {livePending.map((t) => (
                <div key={t.id} className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-display text-[15px] font-semibold text-ink">{t.title}</p>
                    <p className="text-[12.5px] text-slate">{t.agency?.name} &middot; {t.destination?.name}</p>
                    <p className="mt-1 font-mono text-[13px] text-ink">{formatINR(t.price)}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      disabled={busyId === t.id}
                      onClick={() => approveLive(t)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-teal px-4 py-2 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-50"
                    >
                      <Check size={14} /> Approve
                    </button>
                    <button
                      disabled={busyId === t.id}
                      onClick={() => setRejectTarget({ id: t.id, title: t.title })}
                      className="inline-flex items-center gap-1.5 rounded-full border border-danger px-4 py-2 text-[13px] font-medium text-danger hover:bg-danger/5 disabled:opacity-50"
                    >
                      <X size={14} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              {mockPending.length === 0 && (
                <p className="rounded-[var(--radius-lg)] border border-line bg-white p-6 text-center text-sm text-slate">Nothing waiting for review.</p>
              )}
              {mockPending.map((t) => (
                <div key={t.id} className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-display text-[15px] font-semibold text-ink">{t.title}</p>
                      <span className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        t.type === "new" ? "bg-gold-pale text-gold-deep" : "bg-teal-soft text-teal"
                      )}>
                        {t.type === "new" ? "New tour" : "Edit to live tour"}
                      </span>
                    </div>
                    <p className="text-[12.5px] text-slate">{t.agencyName} &middot; {t.destination} &middot; submitted {t.submittedAt}</p>
                    <p className="mt-1 font-mono text-[13px] text-ink">{formatINR(t.price)}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => setMockPending((prev) => prev.filter((x) => x.id !== t.id))}
                      className="inline-flex items-center gap-1.5 rounded-full bg-teal px-4 py-2 text-[13px] font-medium text-white hover:opacity-90"
                    >
                      <Check size={14} /> Approve
                    </button>
                    <button
                      onClick={() => setRejectTarget({ slug: t.id, title: t.title })}
                      className="inline-flex items-center gap-1.5 rounded-full border border-danger px-4 py-2 text-[13px] font-medium text-danger hover:bg-danger/5"
                    >
                      <X size={14} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </section>

      <section>
        <h2 className="font-display text-base font-semibold text-ink">
          Published tours ({usingLive ? livePublished.length : mockTours.length})
        </h2>
        <p className="mt-1 text-[12.5px] text-slate">Toggle the star to feature a tour on the homepage.</p>
        <div className="mt-3 overflow-x-auto rounded-[var(--radius-lg)] border border-line bg-white">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-[12px] text-slate">
                <th className="px-4 py-3 font-medium">Tour</th>
                <th className="px-4 py-3 font-medium">Agency</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {usingLive
                ? livePublished.map((t) => (
                    <tr key={t.id}>
                      <td className="px-4 py-3 font-medium text-ink">{t.title}</td>
                      <td className="px-4 py-3 text-ink/80">{t.agency?.name}</td>
                      <td className="px-4 py-3 font-mono text-ink/80">{formatINR(t.price)}</td>
                      <td className="px-4 py-3 text-ink/80">{t.rating_avg.toFixed(1)} ({t.review_count})</td>
                      <td className="px-4 py-3">
                        <button disabled={busyId === t.id} onClick={() => toggleFeaturedLive(t)} aria-label="Toggle featured">
                          <Star size={16} className={t.featured ? "fill-gold text-gold" : "text-line-strong"} />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <a href={`/tours/${t.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[12px] text-teal hover:underline">
                          View <ExternalLink size={11} />
                        </a>
                      </td>
                    </tr>
                  ))
                : mockTours.map((t) => (
                    <tr key={t.slug}>
                      <td className="px-4 py-3 font-medium text-ink">{t.title}</td>
                      <td className="px-4 py-3 text-ink/80">{t.agency.name}</td>
                      <td className="px-4 py-3 font-mono text-ink/80">{formatINR(t.price)}</td>
                      <td className="px-4 py-3 text-ink/80">{t.rating.toFixed(1)} ({t.reviewCount})</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setMockFeatured((prev) => prev.includes(t.slug) ? prev.filter((s) => s !== t.slug) : [...prev, t.slug])}
                          aria-label="Toggle featured"
                        >
                          <Star size={16} className={mockFeatured.includes(t.slug) ? "fill-gold text-gold" : "text-line-strong"} />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <a href={`/tours/${t.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[12px] text-teal hover:underline">
                          View <ExternalLink size={11} />
                        </a>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </section>

      {rejectTarget && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setRejectTarget(null)} />
          <div className="relative w-full max-w-sm rounded-[var(--radius-lg)] bg-white p-6">
            <h3 className="font-display text-lg font-semibold text-ink">Reject &quot;{rejectTarget.title}&quot;?</h3>
            <p className="mt-1 text-sm text-slate">The agency will see this reason and can resubmit.</p>
            <RejectForm onConfirm={rejectConfirm} />
            <button onClick={() => setRejectTarget(null)} className="mt-2 w-full rounded-full border border-line py-2.5 text-sm font-medium text-ink">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

function RejectForm({ onConfirm }: { onConfirm: (reason: string) => void }) {
  const [reason, setReason] = useState("");
  return (
    <>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={3}
        placeholder="e.g. Inclusions list doesn't match the itinerary."
        className="mt-3 w-full resize-none rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-danger"
      />
      <button onClick={() => onConfirm(reason)} className="mt-3 w-full rounded-full bg-danger py-2.5 text-sm font-medium text-white hover:opacity-90">
        Reject
      </button>
    </>
  );
}
