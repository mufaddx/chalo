"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

export default function EditableList({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    if (!draft.trim()) return;
    onChange([...items, draft.trim()]);
    setDraft("");
  };

  return (
    <div>
      <label className="text-[13px] font-medium text-slate">{label}</label>
      <div className="mt-2 flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between gap-2 rounded-xl border border-line bg-paper-soft px-3.5 py-2">
            <span className="text-[13.5px] text-ink/85">{item}</span>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="shrink-0 text-slate hover:text-danger"
              aria-label="Remove"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink"
        />
        <button
          type="button"
          onClick={add}
          className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-line px-3.5 py-2.5 text-sm font-medium text-ink hover:border-ink"
        >
          <Plus size={14} /> Add
        </button>
      </div>
    </div>
  );
}
