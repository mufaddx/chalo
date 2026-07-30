"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, CalendarCheck, IndianRupee, PackagePlus, Sparkle, Users,
} from "lucide-react";
import { agencyBookings as mockBookings, agencyStats as mockAgencyStats, currentAgency, revenueByMonth } from "@/lib/agency-dashboard-data";
import { fetchAgencyBookings, fetchAgencyTours } from "@/lib/api/agency";
import type { ApiBooking } from "@/lib/api/types";
import { formatINR } from "@/lib/utils";
import { AgencyBookingStatusBadge } from "@/components/agency-dashboard/status-badge";
import { DemoDataBanner, LiveDataBanner } from "@/components/dashboard/data-source-banner";

export default function AgencyDashboardOverviewPage() {
  const [source, setSource] = useState<"loading" | "live" | "offline">("loading");
  const [liveBookings, setLiveBookings] = useState<ApiBooking[]>([]);
  const [liveTourCount, setLiveTourCount] = useState(0);

  useEffect(() => {
    Promise.all([fetchAgencyBookings(), fetchAgencyTours()])
      .then(([bookingsRes, toursRes]) => {
        setLiveBookings(bookingsRes.data);
        setLiveTourCount(toursRes.meta?.total ?? toursRes.data.length);
        setSource("live");
      })
      .catch(() => setSource("offline"));
  }, []);

  const usingLive = source === "live";
  const mock = mockAgencyStats();
  const maxRevenue = Math.max(...revenueByMonth.map((r) => r.value));

  const liveStats = {
    pending: liveBookings.filter((b) => b.status === "pending").length,
    upcoming: liveBookings.filter((b) => b.status === "confirmed" || b.status === "pending").length,
    revenue: liveBookings.filter((b) => b.payment_status === "paid").reduce((s, b) => s + b.total_amount, 0),
  };

  const statCards = usingLive
    ? [
        { label: "Pending bookings", value: liveStats.pending, icon: Sparkle },
        { label: "Upcoming tours", value: liveStats.upcoming, icon: CalendarCheck },
        { label: "Active tours", value: liveTourCount, icon: Users },
      ]
    : [
        { label: "Today's bookings", value: mock.today, icon: Sparkle },
        { label: "Upcoming tours", value: mock.upcoming, icon: CalendarCheck },
        { label: "Pending action", value: mock.pendingCount, icon: Users },
      ];

  const revenue = usingLive ? liveStats.revenue : mock.revenue;
  const recentBookings = usingLive ? liveBookings.slice(0, 4) : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Welcome back, {currentAgency.name}</h1>
        <p className="mt-1 text-sm text-slate">Here&apos;s how things are looking today.</p>
      </div>

      {source === "live" && <LiveDataBanner />}
      {source === "offline" && <DemoDataBanner reason="offline" />}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-[var(--radius-lg)] border border-line bg-white p-4">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-paper-soft text-teal">
              <s.icon size={16} />
            </span>
            <p className="mt-3 font-display text-2xl font-semibold text-ink">{s.value}</p>
            <p className="text-[12px] text-slate">{s.label}</p>
          </div>
        ))}
        <div className="rounded-[var(--radius-lg)] border border-line bg-white p-4">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-pale text-gold-deep">
            <IndianRupee size={16} />
          </span>
          <p className="mt-3 font-mono text-2xl font-semibold text-ink">{formatINR(revenue)}</p>
          <p className="text-[12px] text-slate">{usingLive ? "from paid bookings" : "total revenue"}</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link href="/agency/dashboard/tours/new" className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-line bg-white p-4 hover:border-ink">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-gold"><PackagePlus size={17} /></span>
          <span>
            <span className="block text-[14px] font-medium text-ink">Create a new tour</span>
            <span className="block text-[12px] text-slate">Goes live after admin approval</span>
          </span>
        </Link>
        <Link href={usingLive ? "/agency/dashboard/bookings?status=pending" : "/agency/dashboard/bookings?status=new"} className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-line bg-white p-4 hover:border-ink">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-danger/10 text-danger"><CalendarCheck size={17} /></span>
          <span>
            <span className="block text-[14px] font-medium text-ink">Review pending bookings</span>
            <span className="block text-[12px] text-slate">{usingLive ? liveStats.pending : mock.today} awaiting your response</span>
          </span>
        </Link>
        <Link href="/agency/dashboard/profile" className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-line bg-white p-4 hover:border-ink">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
            <Image src={currentAgency.logo} alt={currentAgency.name} fill className="object-cover" />
          </div>
          <span>
            <span className="block text-[14px] font-medium text-ink">Update agency profile</span>
            <span className="block text-[12px] text-slate">Logo, about, contact details</span>
          </span>
        </Link>
      </div>

      {/* Revenue chart — sample only; the API doesn't expose historical revenue by month yet */}
      <div className="rounded-[var(--radius-lg)] border border-line bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-ink">Revenue, last 6 months</h2>
          {usingLive && <span className="text-[11px] text-slate">Sample chart</span>}
        </div>
        <div className="mt-5 flex h-40 items-end gap-3">
          {revenueByMonth.map((m) => (
            <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-32 w-full items-end">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-teal to-teal/60"
                  style={{ height: `${(m.value / maxRevenue) * 100}%` }}
                  title={formatINR(m.value)}
                />
              </div>
              <span className="text-[11px] text-slate">{m.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent bookings */}
      <div className="rounded-[var(--radius-lg)] border border-line bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-ink">Recent bookings</h2>
          <Link href="/agency/dashboard/bookings" className="inline-flex items-center gap-1 text-sm font-medium text-teal">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-4 flex flex-col divide-y divide-line">
          {(recentBookings ?? mockBookings.slice(0, 4)).map((b, i) => {
            const isLive = "booking_number" in b;
            const customer = isLive ? (b as ApiBooking).customer_name : (b as (typeof mockBookings)[number]).customerName;
            const title = isLive ? (b as ApiBooking).tour?.title : (b as (typeof mockBookings)[number]).tour.title;
            const bookingNumber = isLive ? (b as ApiBooking).booking_number : (b as (typeof mockBookings)[number]).bookingNumber;
            const travelDate = isLive ? (b as ApiBooking).travel_date : (b as (typeof mockBookings)[number]).travelDate;
            const status = b.status;
            return (
              <div key={bookingNumber ?? i} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-medium text-ink">{customer} &middot; {title}</p>
                  <p className="text-[12px] text-slate">{bookingNumber} &middot; {travelDate}</p>
                </div>
                <AgencyBookingStatusBadge status={status} className="shrink-0" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
