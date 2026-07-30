"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { adminCoupons as mockInitial, type AdminCoupon } from "@/lib/admin-data";
import { fetchAdminCoupons, createCoupon, updateCoupon, deleteCoupon, type ApiCoupon } from "@/lib/api/admin-cms";
import { cn } from "@/lib/utils";
import CrudFormModal, { type CrudField } from "@/components/admin-dashboard/crud-form-modal";
import { DemoDataBanner, LiveDataBanner } from "@/components/dashboard/data-source-banner";

const FIELDS: CrudField[] = [
  { name: "code", label: "Coupon code", placeholder: "e.g. FESTIVE500" },
  { name: "type", label: "Discount type", type: "select", options: ["flat", "percent"] },
  { name: "value", label: "Value", type: "number", placeholder: "500 or 10" },
  { name: "usage_limit", label: "Usage limit", type: "number", placeholder: "500" },
  { name: "valid_until", label: "Valid until", type: "date" },
];

export default function AdminCouponsPage() {
  const [source, setSource] = useState<"loading" | "live" | "offline">("loading");
  const [liveCoupons, setLiveCoupons] = useState<ApiCoupon[]>([]);
  const [mockCoupons, setMockCoupons] = useState<AdminCoupon[]>(mockInitial);
  const [modalOpen, setModalOpen] = useState(false);

  const load = () => {
    fetchAdminCoupons()
      .then((res) => { setLiveCoupons(res.data); setSource("live"); })
      .catch(() => setSource("offline"));
  };
  useEffect(() => { load(); }, []);
  const usingLive = source === "live";

  const toggleLive = async (c: ApiCoupon) => {
    try { await updateCoupon(c.id, { is_active: !c.is_active }); load(); } catch { /* no-op */ }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Coupons</h1>
          <p className="mt-1 text-sm text-slate">Platform-wide or agency-specific discount codes.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-teal">
          <Plus size={15} /> Create coupon
        </button>
      </div>

      {source === "live" && <LiveDataBanner />}
      {source === "offline" && <DemoDataBanner reason="offline" />}

      <div className="mt-5 overflow-x-auto rounded-[var(--radius-lg)] border border-line bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[12px] text-slate">
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Discount</th>
              <th className="px-4 py-3 font-medium">Scope</th>
              <th className="px-4 py-3 font-medium">Usage</th>
              <th className="px-4 py-3 font-medium">Valid until</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {usingLive
              ? liveCoupons.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-3 font-mono font-medium text-ink">{c.code}</td>
                    <td className="px-4 py-3 text-ink/85">{c.type === "flat" ? `₹${c.value} off` : `${c.value}% off`}</td>
                    <td className="px-4 py-3 text-ink/85">{c.agency?.name ?? "Platform-wide"}</td>
                    <td className="px-4 py-3 text-ink/85">{c.used_count} / {c.usage_limit ?? "∞"}</td>
                    <td className="px-4 py-3 text-ink/85">{c.valid_until ?? "—"}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleLive(c)} className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", c.is_active ? "bg-teal-soft text-teal" : "bg-paper-dim text-slate")}>
                        {c.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={async () => { try { await deleteCoupon(c.id); load(); } catch { /* no-op */ } }} aria-label="Delete" className="text-slate hover:text-danger">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              : mockCoupons.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-3 font-mono font-medium text-ink">{c.code}</td>
                    <td className="px-4 py-3 text-ink/85">{c.type === "flat" ? `₹${c.value} off` : `${c.value}% off`}</td>
                    <td className="px-4 py-3 text-ink/85">{c.scope}</td>
                    <td className="px-4 py-3 text-ink/85">{c.used} / {c.usageLimit}</td>
                    <td className="px-4 py-3 text-ink/85">{c.validUntil}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setMockCoupons((prev) => prev.map((x) => x.id === c.id ? { ...x, active: !x.active } : x))} className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", c.active ? "bg-teal-soft text-teal" : "bg-paper-dim text-slate")}>
                        {c.active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setMockCoupons((prev) => prev.filter((x) => x.id !== c.id))} aria-label="Delete" className="text-slate hover:text-danger">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <CrudFormModal
          title="Create coupon"
          fields={FIELDS}
          onCancel={() => setModalOpen(false)}
          onSubmit={async (v) => {
            if (usingLive) {
              try {
                await createCoupon({
                  code: String(v.code).toUpperCase(), type: v.type as "flat" | "percent", value: Number(v.value),
                  usage_limit: Number(v.usage_limit) || undefined, valid_until: String(v.valid_until) || undefined,
                });
                load();
              } catch { /* no-op */ }
            } else {
              setMockCoupons((prev) => [...prev, {
                id: String(Date.now()), code: String(v.code).toUpperCase(), type: v.type as "flat" | "percent", value: Number(v.value),
                scope: "Platform-wide", usageLimit: Number(v.usage_limit) || 100, used: 0, validUntil: String(v.valid_until || "—"), active: true,
              }]);
            }
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
