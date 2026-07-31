"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutGrid, Package, CalendarCheck, Users, Star, Store, LogOut, BadgeCheck, Clapperboard,
} from "lucide-react";
import { currentAgency, agencyStats } from "@/lib/agency-dashboard-data";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", href: "/agency/dashboard", icon: LayoutGrid },
  { label: "Tours", href: "/agency/dashboard/tours", icon: Package },
  { label: "Bookings", href: "/agency/dashboard/bookings", icon: CalendarCheck },
  { label: "Customers", href: "/agency/dashboard/customers", icon: Users },
  { label: "Reviews", href: "/agency/dashboard/reviews", icon: Star },
  { label: "Videos", href: "/agency/dashboard/videos", icon: Clapperboard },
  { label: "Agency Profile", href: "/agency/dashboard/profile", icon: Store },
];

export default function AgencySidebar() {
  const pathname = usePathname();
  const stats = agencyStats();

  return (
    <aside className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-line px-5 py-6">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-line">
          <Image src={currentAgency.logo} alt={currentAgency.name} fill className="object-cover" />
        </div>
        <div className="min-w-0">
          <p className="flex items-center gap-1 truncate font-display text-[14px] font-semibold text-ink">
            {currentAgency.name} <BadgeCheck size={13} className="shrink-0 text-teal" />
          </p>
          <p className="truncate text-[12px] text-slate">{currentAgency.city}</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4">
        {NAV.map((item) => {
          const active = item.href === "/agency/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors",
                active ? "bg-ink text-white" : "text-ink/75 hover:bg-paper-soft"
              )}
            >
              <span className="flex items-center gap-2.5">
                <item.icon size={17} />
                {item.label}
              </span>
              {item.href === "/agency/dashboard/bookings" && stats.pendingCount > 0 && (
                <span className={cn(
                  "grid h-5 min-w-5 place-items-center rounded-full px-1 text-[10px] font-semibold",
                  active ? "bg-gold text-ink" : "bg-danger text-white"
                )}>
                  {stats.pendingCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-line p-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14px] font-medium text-ink/75 hover:bg-paper-soft"
        >
          <LogOut size={17} /> Log out
        </Link>
      </div>
    </aside>
  );
}
