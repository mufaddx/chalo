"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Download, Printer, Users } from "lucide-react";
import { agencyBookings as mockAgencyBookings, type AgencyBooking, type AgencyBookingStatus } from "@/lib/agency-dashboard-data";
import { fetchAgencyBookings } from "@/lib/api/agency";
import type { ApiBooking } from "@/lib/api/types";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { AgencyBookingStatusBadge, PaymentStatusBadge } from "@/components/agency-dashboard/status-badge";
import BookingDetailDrawer from "@/components/agency-dashboard/booking-detail-drawer";
import LiveBookingDetailDrawer from "@/components/agency-dashboard/live-booking-detail-drawer";
import { DemoDataBanner, LiveDataBanner } from "@/components/dashboard/data-source-banner";

const TABS: { label: string; value: AgencyBookingStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

function BookingsContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("status") as AgencyBookingStatus | null) ?? "all";
  const [tab, setTab] = useState<AgencyBookingStatus | "all">(initialTab);

  const [source, setSource] = useState<"loading" | "live" | "offline">("loading");
  const [liveBookings, setLiveBookings] = useState<ApiBooking[]>([]);
  const [mockBookings, setMockBookings] = useState<AgencyBooking[]>(mockAgencyBookings);
  const [activeId, setActiveId] = useState<string | number | null>(null);

  useEffect(() => {
    fetchAgencyBookings()
      .then((res) => {
        setLiveBookings(res.data);
        setSource("live");
      })
      .catch(() => setSource("offline"));
  }, []);

  const usingLive = source === "live";

  const filteredLive = tab === "all" ? liveBookings : liveBookings.filter((b) => b.status === tab);
  const filteredMock = tab === "all" ? mockBookings : mockBookings.filter((b) => b.status === tab);
  const filtered = usingLive ? filteredLive : filteredMock;

  const activeLive = usingLive ? liveBookings.find((b) => b.id === activeId) ?? null : null;
  const activeMock = !usingLive ? mockBookings.find((b) => b.id === activeId) ?? null : null;

  const exportCsv = () => {
    const header = "Booking ID,Tour,Customer,Phone,Travellers,Amount,Status\n";
    const rows = usingLive
      ? filteredLive.map((b) => [b.booking_number, b.tour?.title ?? "", b.customer_name, b.customer_phone, b.adults + b.children, b.total_amount, b.status].join(","))
      : filteredMock.map((b) => [b.bookingNumber, b.tour.title, b.customerName, b.customerPhone, b.travellers, b.totalAmount, b.status].join(","));
    const blob = new Blob([header + rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bookings.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Bookings</h1>
          <p className="mt-1 text-sm text-slate">{filtered.length} bookings</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCsv} className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2.5 text-sm font-medium text-ink hover:border-ink">
            <Download size={15} /> Export CSV
          </button>
          <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2.5 text-sm font-medium text-ink hover:border-ink">
            <Printer size={15} /> Print
          </button>
        </div>
      </div>

      {source === "live" && <LiveDataBanner />}
      {source === "offline" && <DemoDataBanner reason="offline" />}

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {TABS.filter((t) => !usingLive || t.value !== "new").map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-[13px] font-medium transition-colors",
              tab === t.value ? "border-ink bg-ink text-white" : "border-line text-slate hover:border-ink hover:text-ink"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-x-auto rounded-[var(--radius-lg)] border border-line bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[12px] text-slate">
              <th className="px-4 py-3 font-medium">Booking</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Travel date</th>
              <th className="px-4 py-3 font-medium">Travellers</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Payment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {usingLive
              ? filteredLive.map((b) => (
                  <tr key={b.id} onClick={() => setActiveId(b.id)} className="cursor-pointer hover:bg-paper-soft">
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{b.tour?.title}</p>
                      <p className="font-mono text-[11px] text-slate">{b.booking_number}</p>
                    </td>
                    <td className="px-4 py-3 text-ink/85">{b.customer_name}</td>
                    <td className="px-4 py-3 text-ink/85">{b.travel_date}</td>
                    <td className="px-4 py-3 text-ink/85"><span className="inline-flex items-center gap-1"><Users size={12} /> {b.adults + b.children}</span></td>
                    <td className="px-4 py-3 font-mono text-ink/85">{formatINR(b.total_amount)}</td>
                    <td className="px-4 py-3"><AgencyBookingStatusBadge status={b.status} /></td>
                    <td className="px-4 py-3"><PaymentStatusBadge status={b.payment_status} /></td>
                  </tr>
                ))
              : filteredMock.map((b) => (
                  <tr key={b.id} onClick={() => setActiveId(b.id)} className="cursor-pointer hover:bg-paper-soft">
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{b.tour.title}</p>
                      <p className="font-mono text-[11px] text-slate">{b.bookingNumber}</p>
                    </td>
                    <td className="px-4 py-3 text-ink/85">{b.customerName}</td>
                    <td className="px-4 py-3 text-ink/85">{b.travelDate}</td>
                    <td className="px-4 py-3 text-ink/85"><span className="inline-flex items-center gap-1"><Users size={12} /> {b.travellers}</span></td>
                    <td className="px-4 py-3 font-mono text-ink/85">{formatINR(b.totalAmount)}</td>
                    <td className="px-4 py-3"><AgencyBookingStatusBadge status={b.status} /></td>
                    <td className="px-4 py-3"><PaymentStatusBadge status={b.paymentStatus} /></td>
                  </tr>
                ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate">No bookings in this tab.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {activeLive && (
        <LiveBookingDetailDrawer
          booking={activeLive}
          onClose={() => setActiveId(null)}
          onUpdate={(updated) => setLiveBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)))}
        />
      )}
      {activeMock && (
        <BookingDetailDrawer
          booking={activeMock}
          onClose={() => setActiveId(null)}
          onUpdate={(updated) => setMockBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)))}
        />
      )}
    </div>
  );
}

export default function AgencyBookingsPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-sm text-slate">Loading bookings…</div>}>
      <BookingsContent />
    </Suspense>
  );
}
