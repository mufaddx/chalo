"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { destinations as seed } from "@/lib/admin-data";
import { fetchAdminDestinations, createDestination, deleteDestination, type ApiDestination } from "@/lib/api/admin-cms";
import CrudFormModal, { type CrudField } from "@/components/admin-dashboard/crud-form-modal";
import { DemoDataBanner, LiveDataBanner } from "@/components/dashboard/data-source-banner";

const FIELDS: CrudField[] = [
  { name: "name", label: "Destination name", placeholder: "e.g. Coorg" },
  { name: "country", label: "Country", placeholder: "e.g. India" },
];

export default function AdminDestinationsPage() {
  const [source, setSource] = useState<"loading" | "live" | "offline">("loading");
  const [liveRows, setLiveRows] = useState<ApiDestination[]>([]);
  const [mockRows, setMockRows] = useState(seed.map((d, i) => ({ id: String(i), ...d })));
  const [modalOpen, setModalOpen] = useState(false);

  const load = () => {
    fetchAdminDestinations()
      .then((data) => { setLiveRows(data); setSource("live"); })
      .catch(() => setSource("offline"));
  };
  useEffect(() => { load(); }, []);
  const usingLive = source === "live";

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Destinations</h1>
          <p className="mt-1 text-sm text-slate">Shown on the homepage and used to group tours.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-teal">
          <Plus size={15} /> Add destination
        </button>
      </div>

      {source === "live" && <LiveDataBanner />}
      {source === "offline" && <DemoDataBanner reason="offline" />}

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {usingLive
          ? liveRows.map((d) => (
              <div key={d.id} className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-line bg-white p-3.5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-paper-soft text-slate"><MapPin size={16} /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium text-ink">{d.name}</p>
                  <p className="text-[11.5px] text-slate">{d.country} &middot; {d.tours_count ?? 0} tours</p>
                </div>
                <button onClick={async () => { try { await deleteDestination(d.id); load(); } catch { /* no-op */ } }} aria-label="Remove" className="shrink-0 text-slate hover:text-danger">
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          : mockRows.map((d) => (
              <div key={d.id} className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-line bg-white p-3.5">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                  <Image src={d.image} alt={d.name} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium text-ink">{d.name}</p>
                  <p className="flex items-center gap-1 text-[11.5px] text-slate"><MapPin size={10} /> {d.country} &middot; {d.tourCount} tours</p>
                </div>
                <button onClick={() => setMockRows((prev) => prev.filter((x) => x.id !== d.id))} aria-label="Remove" className="shrink-0 text-slate hover:text-danger">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
      </div>

      {modalOpen && (
        <CrudFormModal
          title="Add destination"
          fields={FIELDS}
          onCancel={() => setModalOpen(false)}
          onSubmit={async (v) => {
            if (usingLive) {
              try { await createDestination({ name: String(v.name), country: String(v.country) }); load(); } catch { /* no-op */ }
            } else {
              setMockRows((prev) => [...prev, {
                id: String(Date.now()), name: String(v.name), country: String(v.country),
                image: `https://picsum.photos/seed/dest-${Date.now()}/400/400`, tourCount: 0, coordinates: "—",
              }]);
            }
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
