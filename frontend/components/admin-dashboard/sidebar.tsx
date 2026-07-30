"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid, Building2, Package, CalendarCheck, UsersRound, FolderTree, MapPinned,
  Ticket, Image as ImageIcon, Newspaper, FileText, LifeBuoy, Settings2, LogOut, Compass,
} from "lucide-react";
import { adminStats } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
  { label: "Agencies", href: "/admin/agencies", icon: Building2, badgeKey: "pendingAgencies" as const },
  { label: "Tours", href: "/admin/tours", icon: Package, badgeKey: "pendingTours" as const },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { label: "Users", href: "/admin/users", icon: UsersRound },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Destinations", href: "/admin/destinations", icon: MapPinned },
  { label: "Coupons", href: "/admin/coupons", icon: Ticket },
  { label: "Banners", href: "/admin/banners", icon: ImageIcon },
  { label: "Blogs", href: "/admin/blogs", icon: Newspaper },
  { label: "Pages", href: "/admin/pages", icon: FileText },
  { label: "Support Tickets", href: "/admin/support", icon: LifeBuoy, badgeKey: "openTickets" as const },
  { label: "Settings", href: "/admin/settings", icon: Settings2 },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const stats = adminStats();

  return (
    <aside className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-line px-5 py-6">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-gold">
          <Compass size={18} />
        </span>
        <div className="min-w-0">
          <p className="truncate font-display text-[14.5px] font-semibold text-ink">Voyagr Admin</p>
          <p className="truncate text-[12px] text-slate">Super Admin</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4">
        {NAV.map((item) => {
          const active = pathname.startsWith(item.href);
          const badge = item.badgeKey ? stats[item.badgeKey] : 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-colors",
                active ? "bg-ink text-white" : "text-ink/75 hover:bg-paper-soft"
              )}
            >
              <span className="flex items-center gap-2.5">
                <item.icon size={16} />
                {item.label}
              </span>
              {badge > 0 && (
                <span className={cn(
                  "grid h-5 min-w-5 place-items-center rounded-full px-1 text-[10px] font-semibold",
                  active ? "bg-gold text-ink" : "bg-danger text-white"
                )}>
                  {badge}
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
