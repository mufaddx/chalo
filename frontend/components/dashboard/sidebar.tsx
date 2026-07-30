"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutGrid, CalendarCheck, Heart, Scale, Users, User, Bell, LifeBuoy, Settings, LogOut,
} from "lucide-react";
import { currentCustomer, notifications } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Overview", href: "/dashboard", icon: LayoutGrid },
  { label: "My Bookings", href: "/dashboard/bookings", icon: CalendarCheck },
  { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
  { label: "Compare Tours", href: "/dashboard/compare", icon: Scale },
  { label: "Travellers", href: "/dashboard/travellers", icon: Users },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Support", href: "/dashboard/support", icon: LifeBuoy },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <aside className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-line px-5 py-6">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-line">
          <Image src={currentCustomer.avatar} alt={currentCustomer.name} fill className="object-cover" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-[14.5px] font-semibold text-ink">{currentCustomer.name}</p>
          <p className="truncate text-[12px] text-slate">{currentCustomer.email}</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4">
        {NAV.map((item) => {
          const active = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
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
              {item.href === "/dashboard/notifications" && unreadCount > 0 && (
                <span className={cn(
                  "grid h-5 min-w-5 place-items-center rounded-full px-1 text-[10px] font-semibold",
                  active ? "bg-gold text-ink" : "bg-danger text-white"
                )}>
                  {unreadCount}
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
