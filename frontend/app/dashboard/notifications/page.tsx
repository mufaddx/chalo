"use client";

import { useState } from "react";
import { Bell, CalendarCheck, Gift, Megaphone, MessageSquare } from "lucide-react";
import { notifications as initial, type DashboardNotification } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

const TYPE_META: Record<DashboardNotification["type"], { icon: typeof Bell; color: string; label: string }> = {
  booking: { icon: CalendarCheck, color: "text-teal", label: "Booking" },
  offer: { icon: Gift, color: "text-gold-deep", label: "Offer" },
  agency: { icon: MessageSquare, color: "text-ink", label: "Agency" },
  announcement: { icon: Megaphone, color: "text-slate", label: "Announcement" },
};

export default function NotificationsPage() {
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<DashboardNotification["type"] | "all">("all");

  const filtered = filter === "all" ? items : items.filter((n) => n.type === filter);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">Notifications</h1>
        <button
          onClick={() => setItems((prev) => prev.map((n) => ({ ...n, read: true })))}
          className="text-sm font-medium text-teal hover:underline"
        >
          Mark all as read
        </button>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {(["all", "booking", "offer", "agency", "announcement"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-[13px] font-medium capitalize transition-colors",
              filter === f ? "border-ink bg-ink text-white" : "border-line text-slate hover:border-ink hover:text-ink"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-col divide-y divide-line rounded-[var(--radius-lg)] border border-line bg-white">
        {filtered.map((n) => {
          const meta = TYPE_META[n.type];
          return (
            <button
              key={n.id}
              onClick={() => setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}
              className={cn("flex items-start gap-3 p-4 text-left transition-colors hover:bg-paper-soft", !n.read && "bg-gold-pale/40")}
            >
              <span className={cn("mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-paper-soft", meta.color)}>
                <meta.icon size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-medium text-ink">{n.title}</p>
                  {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold-deep" />}
                </div>
                <p className="mt-0.5 text-[13px] text-slate">{n.body}</p>
                <p className="mt-1 text-[11px] text-slate-soft">{n.date}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
