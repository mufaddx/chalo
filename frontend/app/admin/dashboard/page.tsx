"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, Building2, CalendarCheck, IndianRupee, LifeBuoy, Package, UsersRound,
} from "lucide-react";
import { adminBookings, adminStats as mockAdminStats, revenueByMonth } from "@/lib/admin-data";
import { fetchAdminDashboard, type AdminDashboardStats } from "@/lib/api/admin";
import { formatINR } from "@/lib/utils";
import { DemoDataBanner, LiveDataBanner } from "@/components/dashboard/data-source-banner";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-gold-pale text-gold-deep",
  confirmed: "bg-teal-soft text-teal",
  completed: "bg-paper-dim text-ink/70",
  cancelled: "bg-danger/10 text-danger",
};

interface RecentBookingRow {
  booking_number: string;
  status: string;
  customer_name: string;
  total_amount: string | number;
  tour?: { title: string };
  agency?: { name: string };
}

export default function AdminDashboardPage() {
  const [live, setLive] = useState<AdminDashboardStats | null>(null);
  const [source, setSource] = useState<"loading" | "live" | "offline">("loading");

  useEffect(() => {
    fetchAdminDashboard()
      .then((res) => {
        setLive(res);
        setSource("live");
      })
      .catch(() => setSource("offline"));
  }, []);

  const mock = mockAdminStats();
  const maxRevenue = Math.max(...revenueByMonth.map((r) => r.value));

  const cards = live
    ? [
        { label: "Verified agencies", value: live.agencies.verified, sub: `${live.agencies.pending} pending review`, icon: Building2, href: "/admin/agencies" },
        { label: "Published tours", value: live.tours.published, sub: `${live.tours.pending_approval} pending review`, icon: Package, href: "/admin/tours" },
        { label: "Total bookings", value: live.bookings.total, sub: `${live.bookings.pending} pending`, icon: CalendarCheck, href: "/admin/bookings" },
        { label: "Customers", value: live.customers, sub: "registered accounts", icon: UsersRound, href: "/admin/users" },
      ]
    : [
        { label: "Verified agencies", value: mock.verifiedAgencies, sub: `${mock.pendingAgencies} pending review`, icon: Building2, href: "/admin/agencies" },
        { label: "Published tours", value: mock.publishedTours, sub: `${mock.pendingTours} pending review`, icon: Package, href: "/admin/tours" },
        { label: "Total bookings", value: mock.totalBookings, sub: `${mock.pendingBookings} pending`, icon: CalendarCheck, href: "/admin/bookings" },
        { label: "Customers", value: mock.totalCustomers, sub: "registered accounts", icon: UsersRound, href: "/admin/users" },
      ];

  const revenue = live ? live.bookings.revenue_this_month : mock.totalRevenue;
  const revenueLabel = live ? "Revenue this month" : "Total revenue (non-cancelled)";
  const recentBookings: RecentBookingRow[] | null = live ? (live.recent_bookings as RecentBookingRow[]) : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Platform overview</h1>
        <p className="mt-1 text-sm text-slate">A snapshot of everything happening across Voyagr right now.</p>
      </div>

      {source === "live" && <LiveDataBanner />}
      {source === "offline" && <DemoDataBanner reason="offline" />}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-[var(--radius-lg)] border border-line bg-white p-4 hover:border-ink">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-paper-soft text-teal">
              <c.icon size={16} />
            </span>
            <p className="mt-3 font-display text-2xl font-semibold text-ink">{c.value}</p>
            <p className="text-[12px] text-slate">{c.label}</p>
            <p className="mt-0.5 text-[11px] text-gold-deep">{c.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-[var(--radius-lg)] border border-line bg-white p-4">
          <div className="flex items-center gap-2 text-slate">
            <IndianRupee size={15} />
            <span className="text-[12.5px] font-medium">{revenueLabel}</span>
          </div>
          <p className="mt-2 font-mono text-2xl font-semibold text-ink">{formatINR(Number(revenue))}</p>
        </div>
        <Link href="/admin/support" className="rounded-[var(--radius-lg)] border border-line bg-white p-4 hover:border-ink">
          <div className="flex items-center gap-2 text-slate">
            <LifeBuoy size={15} />
            <span className="text-[12.5px] font-medium">Open support tickets</span>
          </div>
          <p className="mt-2 font-display text-2xl font-semibold text-ink">{mock.openTickets}</p>
          {live && <p className="mt-0.5 text-[11px] text-slate">Support tickets aren&apos;t wired to the API yet — showing sample data.</p>}
        </Link>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-line bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-ink">Platform revenue, last 6 months</h2>
          {live && <span className="text-[11px] text-slate">Sample chart — historical revenue isn&apos;t exposed by the API yet</span>}
        </div>
        <div className="mt-5 flex h-40 items-end gap-3">
          {revenueByMonth.map((m) => (
            <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-32 w-full items-end">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-gold-deep to-gold"
                  style={{ height: `${(m.value / maxRevenue) * 100}%` }}
                  title={formatINR(m.value)}
                />
              </div>
              <span className="text-[11px] text-slate">{m.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-line bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-ink">Recent bookings</h2>
          <Link href="/admin/bookings" className="inline-flex items-center gap-1 text-sm font-medium text-teal">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-4 flex flex-col divide-y divide-line">
          {(recentBookings ?? adminBookings.slice(0, 5)).map((b, i) => {
            const isLiveRow = "booking_number" in b;
            const title = isLiveRow ? (b as RecentBookingRow).tour?.title : (b as (typeof adminBookings)[number]).tourTitle;
            const agency = isLiveRow ? (b as RecentBookingRow).agency?.name : (b as (typeof adminBookings)[number]).agencyName;
            const customer = isLiveRow ? (b as RecentBookingRow).customer_name : (b as (typeof adminBookings)[number]).customerName;
            const bookingNumber = isLiveRow ? (b as RecentBookingRow).booking_number : (b as (typeof adminBookings)[number]).bookingNumber;
            const status = b.status;
            return (
              <div key={bookingNumber ?? i} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-medium text-ink">{customer} &middot; {title}</p>
                  <p className="text-[12px] text-slate">{bookingNumber} &middot; {agency}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${STATUS_STYLES[status]}`}>
                  {status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
