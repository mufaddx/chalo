"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck, CheckCircle2, MapPin, Wallet, XCircle, Clock } from "lucide-react";
import { bookings, currentCustomer, dashboardStats } from "@/lib/dashboard-data";
import { useAuth } from "@/lib/auth/auth-context";
import { formatINR } from "@/lib/utils";
import { BookingStatusBadge } from "@/components/dashboard/status-badge";

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const firstName = (user?.name ?? currentCustomer.name).split(" ")[0];
  const stats = dashboardStats();
  const nextTrip = bookings
    .filter((b) => b.status === "confirmed" || b.status === "pending")
    .sort((a, b) => (a.travelDate < b.travelDate ? -1 : 1))[0];

  const statCards = [
    { label: "Total bookings", value: stats.totalBookings, icon: CalendarCheck },
    { label: "Upcoming trips", value: stats.upcoming, icon: Clock },
    { label: "Completed trips", value: stats.completed, icon: CheckCircle2 },
    { label: "Cancelled", value: stats.cancelled, icon: XCircle },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-sm text-slate">Member since {currentCustomer.memberSince}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-[var(--radius-lg)] border border-line bg-white p-4">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-paper-soft text-teal">
              <s.icon size={16} />
            </span>
            <p className="mt-3 font-display text-2xl font-semibold text-ink">{s.value}</p>
            <p className="text-[12px] text-slate">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-[var(--radius-lg)] border border-line bg-white p-4">
          <div className="flex items-center gap-2 text-slate">
            <Wallet size={15} />
            <span className="text-[12.5px] font-medium">Total amount spent</span>
          </div>
          <p className="mt-2 font-mono text-2xl font-semibold text-ink">{formatINR(stats.totalSpent)}</p>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-line bg-white p-4">
          <div className="flex items-center gap-2 text-slate">
            <MapPin size={15} />
            <span className="text-[12.5px] font-medium">Favourite destination</span>
          </div>
          <p className="mt-2 font-display text-2xl font-semibold text-ink">{stats.favouriteDestination}</p>
        </div>
      </div>

      {nextTrip && (
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-display text-base font-semibold text-ink">Your next trip</h2>
            <Link href={`/dashboard/bookings/${nextTrip.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-teal">
              View details <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex flex-col gap-4 p-5 sm:flex-row">
            <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-44">
              <Image src={nextTrip.tour.image} alt={nextTrip.tour.title} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-[16px] font-semibold text-ink">{nextTrip.tour.title}</h3>
                <BookingStatusBadge status={nextTrip.status} />
              </div>
              <p className="mt-1 text-sm text-slate">Booking {nextTrip.bookingNumber} · {nextTrip.tour.agency.name}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-ink/80">
                <span>Travel date: <strong>{nextTrip.travelDate}</strong></span>
                <span>Travellers: <strong>{nextTrip.travellers}</strong></span>
                <span>Amount: <strong>{formatINR(nextTrip.totalAmount)}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-[var(--radius-lg)] border border-line bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-ink">Recent bookings</h2>
          <Link href="/dashboard/bookings" className="inline-flex items-center gap-1 text-sm font-medium text-teal">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-4 flex flex-col divide-y divide-line">
          {bookings.slice(0, 3).map((b) => (
            <Link key={b.id} href={`/dashboard/bookings/${b.id}`} className="flex items-center justify-between gap-3 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                  <Image src={b.tour.image} alt={b.tour.title} fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-medium text-ink">{b.tour.title}</p>
                  <p className="text-[12px] text-slate">{b.bookingNumber} · {b.travelDate}</p>
                </div>
              </div>
              <BookingStatusBadge status={b.status} className="shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
