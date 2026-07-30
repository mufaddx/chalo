"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { adminBookings as mockInitial } from "@/lib/admin-data";
import { fetchAdminAllBookings } from "@/lib/api/admin-cms";
import type { ApiBooking } from "@/lib/api/types";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { DemoDataBanner, LiveDataBanner } from "@/components/dashboard/data-source-banner";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-gold-pale text-gold-deep",
  confirmed: "bg-teal-soft text-teal",
  completed: "bg-paper-dim text-ink/70",
  cancelled: "bg-danger/10 text-danger",
};

const TABS = ["all", "pending", "confirmed", "completed", "cancelled"] as const;

export default function AdminBookingsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("all");
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<"loading" | "live" | "offline">("loading");
  const [liveBookings, setLiveBookings] = useState<ApiBooking[]>([]);

  useEffect(() => {
    fetchAdminAllBookings()
      .then((res) => { setLiveBookings(res.data); setSource("live"); })
      .catch(() => setSource("offline"));
  }, []);
  const usingLive = source === "live";

  const filteredLive = liveBookings.filter((b) => {
    if (tab !== "all" && b.status !== tab) return false;
    if (query && !`${b.customer_name} ${b.tour?.title} ${b.agency?.name} ${b.booking_number}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const filteredMock = mockInitial.filter((b) => {
    if (tab !== "all" && b.status !== tab) return false;
    if (query && !`${b.customerName} ${b.tourTitle} ${b.agencyName} ${b.bookingNumber}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const exportCsv = () => {
    const header = "Booking ID,Tour,Agency,Customer,Amount,Status\n";
    const rows = usingLive
      ? filteredLive.map((b) => [b.booking_number, b.tour?.title, b.agency?.name, b.customer_name, b.total_amount, b.status].join(","))
      : filteredMock.map((b) => [b.bookingNumber, b.tourTitle, b.agencyName, b.customerName, b.amount, b.status].join(","));
    const blob = new Blob([header + rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "all-bookings.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Bookings</h1>
          <p className="mt-1 text-sm text-slate">Every booking across every agency on the platform.</p>
        </div>
        <button onClick={exportCsv} className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2.5 text-sm font-medium text-ink hover:border-ink">
          <Download size={15} /> Export CSV
        </button>
      </div>

      {source === "live" && <LiveDataBanner />}
      {source === "offline" && <DemoDataBanner reason="offline" />}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={cn("shrink-0 rounded-full border px-4 py-2 text-[13px] font-medium capitalize transition-colors", tab === t ? "border-ink bg-ink text-white" : "border-line text-slate hover:border-ink hover:text-ink")}>
              {t}
            </button>
          ))}
        </div>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search booking ID, customer, agency..." className="ml-auto h-10 min-w-[220px] rounded-full border border-line px-4 text-sm focus:outline-none focus:border-ink" />
      </div>

      <div className="mt-5 overflow-x-auto rounded-[var(--radius-lg)] border border-line bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[12px] text-slate">
              <th className="px-4 py-3 font-medium">Booking</th>
              <th className="px-4 py-3 font-medium">Agency</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Travel date</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {usingLive
              ? filteredLive.map((b) => (
                  <tr key={b.id} className="hover:bg-paper-soft">
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{b.tour?.title}</p>
                      <p className="font-mono text-[11px] text-slate">{b.booking_number}</p>
                    </td>
                    <td className="px-4 py-3 text-ink/85">{b.agency?.name}</td>
                    <td className="px-4 py-3 text-ink/85">{b.customer_name}</td>
                    <td className="px-4 py-3 text-ink/85">{b.travel_date}</td>
                    <td className="px-4 py-3 font-mono text-ink/85">{formatINR(b.total_amount)}</td>
                    <td className="px-4 py-3"><span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize", STATUS_STYLES[b.status])}>{b.status}</span></td>
                  </tr>
                ))
              : filteredMock.map((b) => (
                  <tr key={b.id} className="hover:bg-paper-soft">
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{b.tourTitle}</p>
                      <p className="font-mono text-[11px] text-slate">{b.bookingNumber}</p>
                    </td>
                    <td className="px-4 py-3 text-ink/85">{b.agencyName}</td>
                    <td className="px-4 py-3 text-ink/85">{b.customerName}</td>
                    <td className="px-4 py-3 text-ink/85">{b.travelDate}</td>
                    <td className="px-4 py-3 font-mono text-ink/85">{formatINR(b.amount)}</td>
                    <td className="px-4 py-3"><span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize", STATUS_STYLES[b.status])}>{b.status}</span></td>
                  </tr>
                ))}
            {(usingLive ? filteredLive : filteredMock).length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-slate">No bookings match.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
