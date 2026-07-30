"use client";

import { Plus, Trash2 } from "lucide-react";
import type { ItineraryDay } from "@/types";

export default function ItineraryBuilder({
  days,
  onChange,
}: {
  days: ItineraryDay[];
  onChange: (days: ItineraryDay[]) => void;
}) {
  const update = (index: number, patch: Partial<ItineraryDay>) => {
    onChange(days.map((d, i) => (i === index ? { ...d, ...patch } : d)));
  };

  const addDay = () => {
    onChange([...days, { day: days.length + 1, title: "", description: "", meals: [] }]);
  };

  const removeDay = (index: number) => {
    onChange(days.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 })));
  };

  return (
    <div className="flex flex-col gap-3">
      {days.map((day, i) => (
        <div key={i} className="rounded-xl border border-line p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[12px] font-semibold text-gold-deep">DAY {day.day}</span>
            <button type="button" onClick={() => removeDay(i)} className="text-slate hover:text-danger" aria-label="Remove day">
              <Trash2 size={14} />
            </button>
          </div>
          <input
            value={day.title}
            onChange={(e) => update(i, { title: e.target.value })}
            placeholder="Day title (e.g. Arrive in Leh, acclimatisation)"
            className="mt-2 w-full rounded-lg border border-line px-3 py-2 text-sm focus:outline-none focus:border-ink"
          />
          <textarea
            value={day.description}
            onChange={(e) => update(i, { description: e.target.value })}
            placeholder="What happens this day"
            rows={2}
            className="mt-2 w-full resize-none rounded-lg border border-line px-3 py-2 text-sm focus:outline-none focus:border-ink"
          />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <input
              value={day.meals.join(", ")}
              onChange={(e) => update(i, { meals: e.target.value.split(",").map((m) => m.trim()).filter(Boolean) })}
              placeholder="Meals (comma separated)"
              className="rounded-lg border border-line px-3 py-2 text-sm focus:outline-none focus:border-ink"
            />
            <input
              value={day.stay ?? ""}
              onChange={(e) => update(i, { stay: e.target.value })}
              placeholder="Stay (e.g. Hotel in Leh)"
              className="rounded-lg border border-line px-3 py-2 text-sm focus:outline-none focus:border-ink"
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addDay}
        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-line-strong py-2.5 text-sm font-medium text-ink hover:border-ink"
      >
        <Plus size={15} /> Add day
      </button>
    </div>
  );
}
