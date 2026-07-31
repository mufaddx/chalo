"use client";

import { useState } from "react";
import { Plane, Plus, Trash2, UserRound, X } from "lucide-react";
import { savedTravellers as initial, type SavedTraveller } from "@/lib/dashboard-data";

export default function TravellersPage() {
  const [travellers, setTravellers] = useState<SavedTraveller[]>(initial);
  const [open, setOpen] = useState(false);

  const addTraveller = (t: Omit<SavedTraveller, "id">) => {
    setTravellers((prev) => [...prev, { ...t, id: `tv${Date.now()}` }]);
    setOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Travellers</h1>
          <p className="mt-1 text-sm text-slate">Save details once, reuse them on every booking.</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-teal"
        >
          <Plus size={15} /> Add traveller
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {travellers.map((t) => (
          <div key={t.id} className="flex items-start gap-3 rounded-[var(--radius-lg)] border border-line bg-white p-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-paper-soft text-teal">
              <UserRound size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="font-display text-[15px] font-semibold text-ink">{t.name}</p>
                <button
                  onClick={() => setTravellers((prev) => prev.filter((x) => x.id !== t.id))}
                  aria-label="Remove traveller"
                  className="text-slate hover:text-danger"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <p className="text-[12.5px] text-slate">{t.relation} · {t.age} yrs · {t.gender}</p>
              {t.passportNumber && (
                <p className="mt-1 inline-flex items-center gap-1.5 text-[12px] text-ink/70">
                  <Plane size={12} /> Passport {t.passportNumber}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {open && <AddTravellerModal onClose={() => setOpen(false)} onAdd={addTraveller} />}
    </div>
  );
}

function AddTravellerModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (t: Omit<SavedTraveller, "id">) => void;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-t-[var(--radius-lg)] bg-white p-6 sm:rounded-[var(--radius-lg)]">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate hover:text-ink" aria-label="Close">
          <X size={20} />
        </button>
        <h3 className="font-display text-lg font-semibold text-ink">Add a traveller</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            onAdd({
              name: String(form.get("name")),
              relation: String(form.get("relation")),
              age: Number(form.get("age")),
              gender: String(form.get("gender")),
              passportNumber: String(form.get("passportNumber") || "") || undefined,
            });
          }}
          className="mt-4 flex flex-col gap-3"
        >
          <input name="name" required placeholder="Full name" className="rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink" />
          <div className="grid grid-cols-2 gap-3">
            <input name="relation" required placeholder="Relation (e.g. Spouse)" className="rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink" />
            <input name="age" required type="number" min={0} max={120} placeholder="Age" className="rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink" />
          </div>
          <select name="gender" required defaultValue="" className="rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-ink">
            <option value="" disabled>Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <input name="passportNumber" placeholder="Passport number (optional)" className="rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink" />
          <button type="submit" className="mt-1 w-full rounded-full bg-ink py-3 text-sm font-medium text-white hover:bg-teal">
            Save traveller
          </button>
        </form>
      </div>
    </div>
  );
}
