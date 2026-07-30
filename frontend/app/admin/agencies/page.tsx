"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Ban, Check, FileText, X } from "lucide-react";
import { agencies as mockVerifiedAgencies } from "@/lib/data";
import { pendingAgencies as mockPendingAgencies, suspendedAgencies, type PendingAgency } from "@/lib/admin-data";
import { fetchAdminAgencies, approveAgency, rejectAgency, suspendAgency } from "@/lib/api/admin";
import type { ApiAgency } from "@/lib/api/types";
import StarRating from "@/components/shared/star-rating";
import { DemoDataBanner, LiveDataBanner } from "@/components/dashboard/data-source-banner";

export default function AdminAgenciesPage() {
  const [source, setSource] = useState<"loading" | "live" | "offline">("loading");
  const [livePending, setLivePending] = useState<ApiAgency[]>([]);
  const [liveVerified, setLiveVerified] = useState<ApiAgency[]>([]);

  const [mockPending, setMockPending] = useState<PendingAgency[]>(mockPendingAgencies);
  const [rejectTarget, setRejectTarget] = useState<{ id?: number; slug?: string; name: string } | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<{ id?: number; name: string } | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const loadLive = () => {
    Promise.all([fetchAdminAgencies("pending"), fetchAdminAgencies("verified")])
      .then(([pendingRes, verifiedRes]) => {
        setLivePending(pendingRes.data);
        setLiveVerified(verifiedRes.data);
        setSource("live");
      })
      .catch(() => setSource("offline"));
  };

  useEffect(() => {
    loadLive();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const usingLive = source === "live";

  const approveLive = async (agency: ApiAgency) => {
    setBusyId(agency.id);
    try {
      await approveAgency(agency.id);
      loadLive();
    } catch {
      // leave as-is; the row's approve button just stays clickable
    } finally {
      setBusyId(null);
    }
  };

  const rejectConfirm = async (reason: string) => {
    if (!rejectTarget) return;
    if (usingLive && rejectTarget.id) {
      setBusyId(rejectTarget.id);
      try {
        await rejectAgency(rejectTarget.id, reason);
        loadLive();
      } catch {
        // no-op — row remains in pending list on failure
      } finally {
        setBusyId(null);
      }
    } else if (rejectTarget.slug) {
      setMockPending((prev) => prev.filter((a) => a.slug !== rejectTarget.slug));
    }
    setRejectTarget(null);
  };

  const suspendConfirm = async (reason: string) => {
    if (!suspendTarget) return;
    if (usingLive && suspendTarget.id) {
      setBusyId(suspendTarget.id);
      try {
        await suspendAgency(suspendTarget.id, reason);
        loadLive();
      } catch {
        // no-op
      } finally {
        setBusyId(null);
      }
    }
    setSuspendTarget(null);
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Agencies</h1>
        <p className="mt-1 text-sm text-slate">Every agency must be verified here before it can publish tours.</p>
      </div>

      {source === "live" && <LiveDataBanner />}
      {source === "offline" && <DemoDataBanner reason="offline" />}

      {/* Pending approval */}
      <section>
        <h2 className="font-display text-base font-semibold text-ink">
          Pending approval ({usingLive ? livePending.length : mockPending.length})
        </h2>
        <div className="mt-3 flex flex-col gap-3">
          {usingLive ? (
            <>
              {livePending.length === 0 && (
                <p className="rounded-[var(--radius-lg)] border border-line bg-white p-6 text-center text-sm text-slate">
                  No agencies waiting for review. 🎉
                </p>
              )}
              {livePending.map((a) => (
                <div key={a.id} className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-display text-[15px] font-semibold text-ink">{a.name}</p>
                    <p className="text-[12.5px] text-slate">{a.city} &middot; {a.years_experience ?? 0} yrs experience &middot; submitted {a.created_at?.slice(0, 10)}</p>
                    {a.owner_email && <p className="mt-1 text-[12.5px] text-slate">{a.owner_email}</p>}
                    {a.verifications?.map((v, i) => (
                      <button key={i} className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[12px] font-medium text-ink hover:border-ink">
                        <FileText size={12} /> {v.document_type}
                      </button>
                    ))}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      disabled={busyId === a.id}
                      onClick={() => approveLive(a)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-teal px-4 py-2 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-50"
                    >
                      <Check size={14} /> Approve
                    </button>
                    <button
                      disabled={busyId === a.id}
                      onClick={() => setRejectTarget({ id: a.id, name: a.name })}
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
                <p className="rounded-[var(--radius-lg)] border border-line bg-white p-6 text-center text-sm text-slate">
                  No agencies waiting for review. 🎉
                </p>
              )}
              {mockPending.map((a) => (
                <div key={a.slug} className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-display text-[15px] font-semibold text-ink">{a.name}</p>
                    <p className="text-[12.5px] text-slate">{a.city} &middot; {a.yearsExperience} yrs experience &middot; submitted {a.submittedAt}</p>
                    <p className="mt-1 text-[12.5px] text-slate">{a.ownerEmail}</p>
                    <button className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[12px] font-medium text-ink hover:border-ink">
                      <FileText size={12} /> {a.documentType}: {a.documentName}
                    </button>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => setMockPending((prev) => prev.filter((x) => x.slug !== a.slug))}
                      className="inline-flex items-center gap-1.5 rounded-full bg-teal px-4 py-2 text-[13px] font-medium text-white hover:opacity-90"
                    >
                      <Check size={14} /> Approve
                    </button>
                    <button
                      onClick={() => setRejectTarget({ slug: a.slug, name: a.name })}
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

      {/* Verified agencies */}
      <section>
        <h2 className="font-display text-base font-semibold text-ink">
          Verified agencies ({usingLive ? liveVerified.length : mockVerifiedAgencies.length})
        </h2>
        <div className="mt-3 overflow-x-auto rounded-[var(--radius-lg)] border border-line bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-[12px] text-slate">
                <th className="px-4 py-3 font-medium">Agency</th>
                <th className="px-4 py-3 font-medium">City</th>
                <th className="px-4 py-3 font-medium">Tours</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {usingLive
                ? liveVerified.map((a) => (
                    <tr key={a.id}>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 font-medium text-ink">
                          {a.name} <BadgeCheck size={13} className="text-teal" />
                        </span>
                      </td>
                      <td className="px-4 py-3 text-ink/80">{a.city}</td>
                      <td className="px-4 py-3 text-ink/80">{a.tour_count ?? "—"}</td>
                      <td className="px-4 py-3"><StarRating rating={a.rating_avg} size={12} showValue /></td>
                      <td className="px-4 py-3 text-right">
                        <button
                          disabled={busyId === a.id}
                          onClick={() => setSuspendTarget({ id: a.id, name: a.name })}
                          className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[12px] font-medium text-danger hover:border-danger disabled:opacity-50"
                        >
                          <Ban size={12} /> Suspend
                        </button>
                      </td>
                    </tr>
                  ))
                : mockVerifiedAgencies.map((a) => (
                    <tr key={a.slug}>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 font-medium text-ink">
                          {a.name} <BadgeCheck size={13} className="text-teal" />
                        </span>
                      </td>
                      <td className="px-4 py-3 text-ink/80">{a.city}</td>
                      <td className="px-4 py-3 text-ink/80">{a.totalTours}</td>
                      <td className="px-4 py-3"><StarRating rating={a.rating} size={12} showValue /></td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSuspendTarget({ name: a.name })}
                          className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[12px] font-medium text-danger hover:border-danger"
                        >
                          <Ban size={12} /> Suspend
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Suspended (demo-only list — no dedicated "suspended" view built here yet) */}
      {!usingLive && suspendedAgencies.length > 0 && (
        <section>
          <h2 className="font-display text-base font-semibold text-ink">Suspended agencies</h2>
          <div className="mt-3 flex flex-col gap-3">
            {suspendedAgencies.map((a) => (
              <div key={a.slug} className="rounded-[var(--radius-lg)] border border-danger/30 bg-danger/[0.03] p-4">
                <p className="font-display text-[15px] font-semibold text-ink">{a.name}</p>
                <p className="text-[12.5px] text-slate">{a.city} &middot; suspended {a.suspendedAt}</p>
                <p className="mt-1.5 text-[13px] text-ink/70">{a.reason}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {rejectTarget && (
        <RejectModal agencyName={rejectTarget.name} onCancel={() => setRejectTarget(null)} onConfirm={rejectConfirm} />
      )}

      {suspendTarget && (
        <SuspendModal agencyName={suspendTarget.name} onCancel={() => setSuspendTarget(null)} onConfirm={suspendConfirm} />
      )}
    </div>
  );
}

function RejectModal({ agencyName, onCancel, onConfirm }: { agencyName: string; onCancel: () => void; onConfirm: (reason: string) => void }) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center">
      <div className="absolute inset-0 bg-ink/50" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-[var(--radius-lg)] bg-white p-6">
        <h3 className="font-display text-lg font-semibold text-ink">Reject {agencyName}?</h3>
        <p className="mt-1 text-sm text-slate">This reason is shown to the agency so they can reapply.</p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          placeholder="e.g. Uploaded document is illegible, please resubmit."
          className="mt-3 w-full resize-none rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-danger"
        />
        <div className="mt-4 flex gap-2">
          <button onClick={onCancel} className="flex-1 rounded-full border border-line py-2.5 text-sm font-medium text-ink">Cancel</button>
          <button onClick={() => onConfirm(reason)} className="flex-1 rounded-full bg-danger py-2.5 text-sm font-medium text-white hover:opacity-90">Reject</button>
        </div>
      </div>
    </div>
  );
}

function SuspendModal({ agencyName, onCancel, onConfirm }: { agencyName: string; onCancel: () => void; onConfirm: (reason: string) => void }) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center">
      <div className="absolute inset-0 bg-ink/50" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-[var(--radius-lg)] bg-white p-6">
        <h3 className="font-display text-lg font-semibold text-ink">Suspend {agencyName}?</h3>
        <p className="mt-1 text-sm text-slate">Their tours are hidden from search immediately. This can be reversed.</p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          placeholder="Reason for suspension"
          className="mt-3 w-full resize-none rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-danger"
        />
        <div className="mt-4 flex gap-2">
          <button onClick={onCancel} className="flex-1 rounded-full border border-line py-2.5 text-sm font-medium text-ink">Cancel</button>
          <button onClick={() => onConfirm(reason)} className="flex-1 rounded-full bg-danger py-2.5 text-sm font-medium text-white hover:opacity-90">Suspend</button>
        </div>
      </div>
    </div>
  );
}
