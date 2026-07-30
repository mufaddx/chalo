"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, Users } from "lucide-react";
import { bookings as mockBookings, type BookingStatus } from "@/lib/dashboard-data";
import { fetchMyBookings, requestCancellation } from "@/lib/api/bookings";
import { isNetworkError } from "@/lib/api/client";
import type { ApiBooking } from "@/lib/api/types";
import { useAuth } from "@/lib/auth/auth-context";
import { formatINR } from "@/lib/utils";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/dashboard/status-badge";
import { DemoDataBanner, LiveDataBanner } from "@/components/dashboard/data-source-banner";
import PayNowButton from "@/components/payment/pay-now-button";
import { cn } from "@/lib/utils";

const TABS: { label: string; value: BookingStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Upcoming", value: "confirmed" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function MyBookingsPage() {
  const { status } = useAuth();
  const [tab, setTab] = useState<BookingStatus | "all">("all");
  const [apiBookings, setApiBookings] = useState<ApiBooking[] | null>(null);
  const [fetchState, setFetchState] = useState<"loading" | "live" | "offline" | "guest">("loading");

  useEffect(() => {
    if (status === "loading") return;
    if (status === "guest") {
      setFetchState("guest");
      return;
    }
    fetchMyBookings()
      .then((res) => {
        setApiBookings(res.data);
        setFetchState("live");
      })
      .catch((err) => {
        setFetchState(isNetworkError(err) ? "offline" : "offline");
      });
  }, [status]);

  const cancelRealBooking = async (id: number) => {
    try {
      const updated = await requestCancellation(id);
      setApiBookings((prev) => (prev ? prev.map((b) => (b.id === id ? updated : b)) : prev));
    } catch {
      // Silently keep prior state — the button itself reflects nothing changed.
    }
  };

  const usingLiveData = fetchState === "live" && apiBookings !== null;

  if (usingLiveData) {
    const filtered = tab === "all" ? apiBookings : apiBookings.filter((b) => b.status === tab);
    return (
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">My Bookings</h1>
        <LiveDataBanner />
        <TabBar tab={tab} onChange={setTab} />
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mt-5 flex flex-col gap-4">
            {filtered.map((b) => (
              <div key={b.id} className="rounded-[var(--radius-lg)] border border-line bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-[15.5px] font-semibold text-ink">{b.tour?.title ?? "Tour"}</span>
                      <BookingStatusBadge status={b.status} />
                    </div>
                    <p className="mt-1 text-[13px] text-slate">
                      {b.booking_number} &middot; {b.agency?.name} &middot; {b.travel_date}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1 text-[13px] text-ink/75">
                      <Users size={12} /> {b.adults + b.children} traveller{b.adults + b.children > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-mono text-base font-semibold text-ink">{formatINR(b.total_amount)}</span>
                    <PaymentStatusBadge status={b.payment_status} />
                    {b.payment_status === "unpaid" && (b.status === "pending" || b.status === "confirmed") && (
                      <PayNowButton
                        bookingId={b.id}
                        className="rounded-full bg-gold px-3 py-1.5 text-[12px] font-semibold text-ink hover:bg-gold-deep"
                      />
                    )}
                    {(b.status === "pending" || b.status === "confirmed") && (
                      <button
                        onClick={() => cancelRealBooking(b.id)}
                        className="rounded-full border border-danger/30 px-3 py-1.5 text-[12px] font-medium text-danger hover:bg-danger/5"
                      >
                        Request cancellation
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Guest, still loading, or API unreachable — fall back to demo data so the
  // page is never empty, but say clearly that it's not real.
  const filtered = tab === "all" ? mockBookings : mockBookings.filter((b) => b.status === tab);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">My Bookings</h1>
      {fetchState !== "loading" && <DemoDataBanner reason={fetchState === "offline" ? "offline" : "guest"} />}
      <TabBar tab={tab} onChange={setTab} />

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-5 flex flex-col gap-4">
          {filtered.map((b) => (
            <div key={b.id} className="overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white">
              <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <Link href={`/dashboard/bookings/${b.id}`} className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl sm:h-20 sm:w-28">
                  <Image src={b.tour.image} alt={b.tour.title} fill className="object-cover" />
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/dashboard/bookings/${b.id}`} className="font-display text-[15.5px] font-semibold text-ink hover:text-teal">
                      {b.tour.title}
                    </Link>
                    <BookingStatusBadge status={b.status} />
                  </div>
                  <p className="mt-1 text-[13px] text-slate">
                    {b.bookingNumber} &middot; {b.tour.agency.name}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-ink/75">
                    <span>Booked: {b.bookingDate}</span>
                    <span>Travel: {b.travelDate}</span>
                    <span className="inline-flex items-center gap-1"><Users size={12} /> {b.travellers}</span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                  <span className="font-mono text-base font-semibold text-ink">{formatINR(b.totalAmount)}</span>
                  <PaymentStatusBadge status={b.paymentStatus} />
                  <div className="flex gap-2">
                    <button className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-[12px] font-medium text-ink hover:border-ink">
                      <Download size={12} /> Invoice
                    </button>
                    <Link
                      href={`/dashboard/bookings/${b.id}`}
                      className="rounded-full bg-ink px-3 py-1.5 text-[12px] font-medium text-white hover:bg-teal"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TabBar({ tab, onChange }: { tab: BookingStatus | "all"; onChange: (t: BookingStatus | "all") => void }) {
  return (
    <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
      {TABS.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={cn(
            "shrink-0 rounded-full border px-4 py-2 text-[13px] font-medium transition-colors",
            tab === t.value ? "border-ink bg-ink text-white" : "border-line text-slate hover:border-ink hover:text-ink"
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-10 flex flex-col items-center gap-2 py-16 text-center">
      <h3 className="font-display text-lg font-semibold text-ink">No bookings here yet</h3>
      <p className="text-sm text-slate">Trips you book will show up in this tab.</p>
      <Link href="/search" className="mt-3 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white">
        Browse tours
      </Link>
    </div>
  );
}
