"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { adminPages as mockInitial, type AdminPage } from "@/lib/admin-data";
import { fetchAdminPages, createPage, deletePage, type ApiPage } from "@/lib/api/admin-cms";
import { cn } from "@/lib/utils";
import CrudFormModal, { type CrudField } from "@/components/admin-dashboard/crud-form-modal";
import { DemoDataBanner, LiveDataBanner } from "@/components/dashboard/data-source-banner";

const FIELDS: CrudField[] = [
  { name: "title", label: "Page title", placeholder: "e.g. Careers" },
  { name: "content", label: "Content", type: "textarea", placeholder: "Page body" },
];

export default function AdminPagesPage() {
  const [source, setSource] = useState<"loading" | "live" | "offline">("loading");
  const [livePages, setLivePages] = useState<ApiPage[]>([]);
  const [mockPages, setMockPages] = useState<AdminPage[]>(mockInitial);
  const [modalOpen, setModalOpen] = useState(false);

  const load = () => {
    fetchAdminPages()
      .then((data) => { setLivePages(data); setSource("live"); })
      .catch(() => setSource("offline"));
  };
  useEffect(() => { load(); }, []);
  const usingLive = source === "live";

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Pages</h1>
          <p className="mt-1 text-sm text-slate">Static content pages — about, terms, policies.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-teal">
          <Plus size={15} /> New page
        </button>
      </div>

      {source === "live" && <LiveDataBanner />}
      {source === "offline" && <DemoDataBanner reason="offline" />}

      <div className="mt-5 flex flex-col divide-y divide-line rounded-[var(--radius-lg)] border border-line bg-white">
        {usingLive
          ? livePages.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="text-[14.5px] font-medium text-ink">{p.title}</p>
                  <p className="font-mono text-[11.5px] text-slate">/{p.slug} &middot; updated {p.updated_at?.slice(0, 10)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize", p.status === "published" ? "bg-teal-soft text-teal" : "bg-gold-pale text-gold-deep")}>
                    {p.status}
                  </span>
                  <button onClick={async () => { try { await deletePage(p.id); load(); } catch { /* no-op */ } }} aria-label="Delete" className="text-slate hover:text-danger">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          : mockPages.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="text-[14.5px] font-medium text-ink">{p.title}</p>
                  <p className="font-mono text-[11.5px] text-slate">/{p.slug} &middot; updated {p.updatedAt}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize", p.status === "published" ? "bg-teal-soft text-teal" : "bg-gold-pale text-gold-deep")}>
                    {p.status}
                  </span>
                  <button onClick={() => setMockPages((prev) => prev.filter((x) => x.id !== p.id))} aria-label="Delete" className="text-slate hover:text-danger">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
      </div>

      {modalOpen && (
        <CrudFormModal
          title="New page"
          fields={FIELDS}
          onCancel={() => setModalOpen(false)}
          onSubmit={async (v) => {
            if (usingLive) {
              try { await createPage({ title: String(v.title), content: String(v.content), status: "draft" }); load(); } catch { /* no-op */ }
            } else {
              setMockPages((prev) => [...prev, { id: String(Date.now()), title: String(v.title), slug: String(v.title).toLowerCase().replace(/\s+/g, "-"), status: "draft", updatedAt: "Today" }]);
            }
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
