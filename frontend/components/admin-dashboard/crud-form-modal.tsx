"use client";

import { useState } from "react";
import { X } from "lucide-react";

export interface CrudField {
  name: string;
  label: string;
  type?: "text" | "number" | "textarea" | "select" | "checkbox" | "date";
  options?: string[];
  placeholder?: string;
}

export default function CrudFormModal({
  title,
  fields,
  initial,
  onCancel,
  onSubmit,
}: {
  title: string;
  fields: CrudField[];
  initial?: Record<string, string | number | boolean>;
  onCancel: () => void;
  onSubmit: (values: Record<string, string | number | boolean>) => void;
}) {
  const [values, setValues] = useState<Record<string, string | number | boolean>>(
    initial ?? Object.fromEntries(fields.map((f) => [f.name, f.type === "checkbox" ? false : ""]))
  );

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-ink/50" onClick={onCancel} />
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-[var(--radius-lg)] bg-white p-6 sm:rounded-[var(--radius-lg)]">
        <button onClick={onCancel} className="absolute right-4 top-4 text-slate hover:text-ink" aria-label="Close">
          <X size={20} />
        </button>
        <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(values);
          }}
          className="mt-4 flex flex-col gap-3"
        >
          {fields.map((f) => (
            <label key={f.name} className="flex flex-col gap-1.5 text-[13px] font-medium text-slate">
              {f.type !== "checkbox" && f.label}
              {f.type === "textarea" ? (
                <textarea
                  required
                  rows={3}
                  value={String(values[f.name] ?? "")}
                  onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="resize-none rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-ink"
                />
              ) : f.type === "select" ? (
                <select
                  value={String(values[f.name] ?? "")}
                  onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                  className="rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-ink"
                >
                  {f.options?.map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : f.type === "checkbox" ? (
                <span className="flex items-center gap-2 text-sm text-ink/85">
                  <input
                    type="checkbox"
                    checked={Boolean(values[f.name])}
                    onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.checked }))}
                    className="h-4 w-4 accent-[var(--ink)]"
                  />
                  {f.label}
                </span>
              ) : (
                <input
                  required
                  type={f.type ?? "text"}
                  value={String(values[f.name] ?? "")}
                  onChange={(e) => setValues((v) => ({ ...v, [f.name]: f.type === "number" ? Number(e.target.value) : e.target.value }))}
                  placeholder={f.placeholder}
                  className="rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-ink"
                />
              )}
            </label>
          ))}
          <button type="submit" className="mt-1 w-full rounded-full bg-ink py-3 text-sm font-medium text-white hover:bg-teal">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
