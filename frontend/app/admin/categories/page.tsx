"use client";

import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { Plus, Trash2 } from "lucide-react";
import { categories as seedCategories } from "@/lib/admin-data";
import { fetchAdminCategories, createCategory, deleteCategory, type ApiCategory } from "@/lib/api/admin-cms";
import CrudFormModal, { type CrudField } from "@/components/admin-dashboard/crud-form-modal";
import { DemoDataBanner, LiveDataBanner } from "@/components/dashboard/data-source-banner";

interface CategoryRow {
  id: number | string;
  name: string;
  icon: string;
}

const FIELDS: CrudField[] = [
  { name: "name", label: "Category name", placeholder: "e.g. Wildlife" },
  { name: "icon", label: "Icon name (Lucide)", placeholder: "e.g. PawPrint" },
  { name: "is_active", label: "Active", type: "checkbox" },
];

export default function AdminCategoriesPage() {
  const [source, setSource] = useState<"loading" | "live" | "offline">("loading");
  const [rows, setRows] = useState<CategoryRow[]>(seedCategories.map((c, i) => ({ id: String(i), name: c.label as string, icon: c.icon })));
  const [modalOpen, setModalOpen] = useState(false);

  const load = () => {
    fetchAdminCategories()
      .then((data) => {
        setRows(data.map((c) => ({ id: c.id, name: c.name, icon: c.icon ?? "Compass" })));
        setSource("live");
      })
      .catch(() => setSource("offline"));
  };

  useEffect(() => { load(); }, []);
  const usingLive = source === "live";

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Categories</h1>
          <p className="mt-1 text-sm text-slate">Trip types shown in search filters and the homepage grid.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-teal">
          <Plus size={15} /> Add category
        </button>
      </div>

      {source === "live" && <LiveDataBanner />}
      {source === "offline" && <DemoDataBanner reason="offline" />}

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {rows.map((c) => {
          const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[c.icon] ?? Icons.Compass;
          return (
            <div key={c.id} className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-line bg-white p-3.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-paper-soft text-ink">
                <Icon size={16} />
              </span>
              <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium text-ink">{c.name}</span>
              <button
                onClick={async () => {
                  if (usingLive) {
                    try { await deleteCategory(Number(c.id)); load(); } catch { /* no-op */ }
                  } else {
                    setRows((prev) => prev.filter((x) => x.id !== c.id));
                  }
                }}
                aria-label="Remove"
                className="shrink-0 text-slate hover:text-danger"
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <CrudFormModal
          title="Add category"
          fields={FIELDS}
          onCancel={() => setModalOpen(false)}
          onSubmit={async (v) => {
            if (usingLive) {
              try {
                await createCategory({ name: String(v.name), icon: String(v.icon || "Compass"), is_active: Boolean(v.is_active) });
                load();
              } catch { /* no-op */ }
            } else {
              setRows((prev) => [...prev, { id: String(Date.now()), name: String(v.name), icon: String(v.icon || "Compass") }]);
            }
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
