"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";
import { adminBanners as mockInitial, type AdminBanner } from "@/lib/admin-data";
import { fetchAdminBanners, createBanner, updateBanner, deleteBanner, type ApiBanner } from "@/lib/api/admin-cms";
import CrudFormModal, { type CrudField } from "@/components/admin-dashboard/crud-form-modal";
import { DemoDataBanner, LiveDataBanner } from "@/components/dashboard/data-source-banner";
import { cn } from "@/lib/utils";

const FIELDS: CrudField[] = [
  { name: "title", label: "Banner title", placeholder: "e.g. Independence Day sale" },
  { name: "image_path", label: "Image URL", placeholder: "https://..." },
  { name: "position", label: "Position", type: "select", options: ["homepage_hero", "homepage_secondary", "category_page"] },
];

export default function AdminBannersPage() {
  const [source, setSource] = useState<"loading" | "live" | "offline">("loading");
  const [liveBanners, setLiveBanners] = useState<ApiBanner[]>([]);
  const [mockBanners, setMockBanners] = useState<AdminBanner[]>(mockInitial);
  const [modalOpen, setModalOpen] = useState(false);

  const load = () => {
    fetchAdminBanners()
      .then((data) => { setLiveBanners(data); setSource("live"); })
      .catch(() => setSource("offline"));
  };
  useEffect(() => { load(); }, []);
  const usingLive = source === "live";

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Banners</h1>
          <p className="mt-1 text-sm text-slate">Homepage and category-page promotional banners.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-teal">
          <Plus size={15} /> Add banner
        </button>
      </div>

      {source === "live" && <LiveDataBanner />}
      {source === "offline" && <DemoDataBanner reason="offline" />}

      <div className="mt-5 flex flex-col gap-3">
        {usingLive
          ? liveBanners.map((b) => (
              <div key={b.id} className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-line bg-white p-4 sm:flex-row sm:items-center">
                <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-paper-dim sm:w-40">
                  {b.image_path && <Image src={b.image_path} alt={b.title ?? ""} fill className="object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14.5px] font-medium text-ink">{b.title}</p>
                  <p className="mt-1 text-[12px] text-slate">{b.position}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={async () => { try { await updateBanner(b.id, { is_active: !b.is_active }); load(); } catch { /* no-op */ } }}
                    className={cn("rounded-full px-3 py-1.5 text-[11px] font-semibold", b.is_active ? "bg-teal-soft text-teal" : "bg-paper-dim text-slate")}
                  >
                    {b.is_active ? "Active" : "Inactive"}
                  </button>
                  <button onClick={async () => { try { await deleteBanner(b.id); load(); } catch { /* no-op */ } }} aria-label="Delete" className="text-slate hover:text-danger">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          : mockBanners.map((b) => (
              <div key={b.id} className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-line bg-white p-4 sm:flex-row sm:items-center">
                <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl sm:w-40">
                  <Image src={b.image} alt={b.title} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14.5px] font-medium text-ink">{b.title}</p>
                  <p className="mt-1 text-[12px] text-slate">{b.position}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button onClick={() => setMockBanners((prev) => prev.map((x) => x.id === b.id ? { ...x, active: !x.active } : x))} className={cn("rounded-full px-3 py-1.5 text-[11px] font-semibold", b.active ? "bg-teal-soft text-teal" : "bg-paper-dim text-slate")}>
                    {b.active ? "Active" : "Inactive"}
                  </button>
                  <button onClick={() => setMockBanners((prev) => prev.filter((x) => x.id !== b.id))} aria-label="Delete" className="text-slate hover:text-danger">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
      </div>

      {modalOpen && (
        <CrudFormModal
          title="Add banner"
          fields={FIELDS}
          onCancel={() => setModalOpen(false)}
          onSubmit={async (v) => {
            if (usingLive) {
              try {
                await createBanner({ title: String(v.title), image_path: String(v.image_path || `https://picsum.photos/seed/banner-${Date.now()}/800/300`), position: v.position as ApiBanner["position"] });
                load();
              } catch { /* no-op */ }
            } else {
              setMockBanners((prev) => [...prev, { id: String(Date.now()), title: String(v.title), position: v.position as AdminBanner["position"], image: `https://picsum.photos/seed/banner-${Date.now()}/800/300`, active: true }]);
            }
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
