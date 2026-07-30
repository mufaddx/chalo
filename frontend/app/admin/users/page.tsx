"use client";

import { useEffect, useState } from "react";
import { Search, ShieldAlert, ShieldCheck } from "lucide-react";
import { adminUsers as mockInitial } from "@/lib/admin-data";
import { fetchAdminCustomers, toggleUserActive, type ApiAdminUser } from "@/lib/api/admin-cms";
import { cn } from "@/lib/utils";
import { DemoDataBanner, LiveDataBanner } from "@/components/dashboard/data-source-banner";

export default function AdminUsersPage() {
  const [source, setSource] = useState<"loading" | "live" | "offline">("loading");
  const [liveUsers, setLiveUsers] = useState<ApiAdminUser[]>([]);
  const [mockUsers, setMockUsers] = useState(mockInitial);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchAdminCustomers()
      .then((res) => { setLiveUsers(res.data); setSource("live"); })
      .catch(() => setSource("offline"));
  }, []);
  const usingLive = source === "live";

  const filteredLive = liveUsers.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(query.toLowerCase()));
  const filteredMock = mockUsers.filter((u) => `${u.name} ${u.email} ${u.city}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Users</h1>
      <p className="mt-1 text-sm text-slate">{usingLive ? liveUsers.length : mockUsers.length} registered customers</p>

      {source === "live" && <LiveDataBanner />}
      {source === "offline" && <DemoDataBanner reason="offline" />}

      <div className="relative mt-4 max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users..." className="h-11 w-full rounded-full border border-line bg-white pl-10 pr-4 text-sm focus:outline-none focus:border-ink" />
      </div>

      <div className="mt-5 overflow-x-auto rounded-[var(--radius-lg)] border border-line bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[12px] text-slate">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Bookings</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {usingLive
              ? filteredLive.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3 font-medium text-ink">{u.name}</td>
                    <td className="px-4 py-3 text-ink/80">{u.email}</td>
                    <td className="px-4 py-3 text-ink/80">{u.bookings_count}</td>
                    <td className="px-4 py-3 text-ink/80">{u.created_at?.slice(0, 10)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={async () => {
                          try {
                            const updated = await toggleUserActive(u.id);
                            setLiveUsers((prev) => prev.map((x) => x.id === u.id ? updated : x));
                          } catch { /* no-op */ }
                        }}
                        className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium", u.is_active ? "border-line text-danger hover:border-danger" : "border-teal text-teal")}
                      >
                        {u.is_active ? <><ShieldAlert size={12} /> Deactivate</> : <><ShieldCheck size={12} /> Reactivate</>}
                      </button>
                    </td>
                  </tr>
                ))
              : filteredMock.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3 font-medium text-ink">{u.name}</td>
                    <td className="px-4 py-3 text-ink/80">{u.email}</td>
                    <td className="px-4 py-3 text-ink/80">{u.totalBookings}</td>
                    <td className="px-4 py-3 text-ink/80">{u.joinedAt}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setMockUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, status: x.status === "active" ? "deactivated" : "active" } : x))}
                        className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium", u.status === "active" ? "border-line text-danger hover:border-danger" : "border-teal text-teal")}
                      >
                        {u.status === "active" ? <><ShieldAlert size={12} /> Deactivate</> : <><ShieldCheck size={12} /> Reactivate</>}
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
