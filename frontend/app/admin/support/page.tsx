"use client";

import { useEffect, useState } from "react";
import { adminTickets as mockInitial, type AdminTicket } from "@/lib/admin-data";
import { fetchAdminTickets, updateTicketStatus, type ApiSupportTicket } from "@/lib/api/support";
import { cn } from "@/lib/utils";
import { DemoDataBanner, LiveDataBanner } from "@/components/dashboard/data-source-banner";

const STATUS_STYLES: Record<string, string> = {
  open: "bg-gold-pale text-gold-deep",
  in_progress: "bg-teal-soft text-teal",
  resolved: "bg-paper-dim text-ink/70",
  closed: "bg-paper-dim text-ink/70",
};

const PRIORITY_STYLES: Record<string, string> = {
  high: "bg-danger/10 text-danger",
  medium: "bg-gold-pale text-gold-deep",
  low: "bg-paper-dim text-slate",
};

export default function AdminSupportPage() {
  const [source, setSource] = useState<"loading" | "live" | "offline">("loading");
  const [liveTickets, setLiveTickets] = useState<ApiSupportTicket[]>([]);
  const [mockTickets, setMockTickets] = useState<AdminTicket[]>(mockInitial);

  useEffect(() => {
    fetchAdminTickets()
      .then((res) => { setLiveTickets(res.data); setSource("live"); })
      .catch(() => setSource("offline"));
  }, []);
  const usingLive = source === "live";

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Support tickets</h1>
      <p className="mt-1 text-sm text-slate">Every open conversation, across all customers and agencies.</p>

      {source === "live" && <LiveDataBanner />}
      {source === "offline" && <DemoDataBanner reason="offline" />}

      <div className="mt-5 overflow-x-auto rounded-[var(--radius-lg)] border border-line bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[12px] text-slate">
              <th className="px-4 py-3 font-medium">Subject</th>
              <th className="px-4 py-3 font-medium">From</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Opened</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {usingLive
              ? liveTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-paper-soft">
                    <td className="px-4 py-3 font-medium text-ink">{t.subject}</td>
                    <td className="px-4 py-3 text-ink/80">{t.user?.name}</td>
                    <td className="px-4 py-3 text-ink/80 capitalize">{t.category}</td>
                    <td className="px-4 py-3"><span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize", PRIORITY_STYLES[t.priority])}>{t.priority}</span></td>
                    <td className="px-4 py-3">
                      <select
                        value={t.status}
                        onChange={async (e) => {
                          const status = e.target.value as ApiSupportTicket["status"];
                          try {
                            const updated = await updateTicketStatus(t.id, status);
                            setLiveTickets((prev) => prev.map((x) => x.id === t.id ? updated : x));
                          } catch { /* no-op */ }
                        }}
                        className={cn("rounded-full border-0 px-2.5 py-1 text-[11px] font-semibold capitalize focus:outline-none", STATUS_STYLES[t.status])}
                      >
                        {(["open", "in_progress", "resolved", "closed"] as const).map((s) => (
                          <option key={s} value={s}>{s.replace("_", " ")}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-ink/80">{t.created_at?.slice(0, 10)}</td>
                  </tr>
                ))
              : mockTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-paper-soft">
                    <td className="px-4 py-3 font-medium text-ink">{t.subject}</td>
                    <td className="px-4 py-3 text-ink/80">{t.from}</td>
                    <td className="px-4 py-3 text-ink/80">{t.category}</td>
                    <td className="px-4 py-3"><span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize", PRIORITY_STYLES[t.priority])}>{t.priority}</span></td>
                    <td className="px-4 py-3">
                      <select
                        value={t.status}
                        onChange={(e) => setMockTickets((prev) => prev.map((x) => x.id === t.id ? { ...x, status: e.target.value as AdminTicket["status"] } : x))}
                        className={cn("rounded-full border-0 px-2.5 py-1 text-[11px] font-semibold capitalize focus:outline-none", STATUS_STYLES[t.status])}
                      >
                        {(["open", "in_progress", "resolved", "closed"] as const).map((s) => (
                          <option key={s} value={s}>{s.replace("_", " ")}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-ink/80">{t.createdAt}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
