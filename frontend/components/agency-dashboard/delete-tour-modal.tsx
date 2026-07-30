"use client";

import { AlertTriangle, X } from "lucide-react";

export default function DeleteTourModal({
  tourTitle,
  onCancel,
  onConfirm,
}: {
  tourTitle: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center">
      <div className="absolute inset-0 bg-ink/50" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-[var(--radius-lg)] bg-white p-6">
        <button onClick={onCancel} className="absolute right-4 top-4 text-slate hover:text-ink" aria-label="Close">
          <X size={20} />
        </button>
        <span className="grid h-11 w-11 place-items-center rounded-full bg-danger/10 text-danger">
          <AlertTriangle size={20} />
        </span>
        <h3 className="mt-4 font-display text-lg font-semibold text-ink">Delete this tour?</h3>
        <p className="mt-2 text-sm text-slate">
          <strong>{tourTitle}</strong> will be removed from search results immediately. Existing confirmed
          bookings are not cancelled automatically.
        </p>
        <div className="mt-5 flex gap-2">
          <button onClick={onCancel} className="flex-1 rounded-full border border-line py-2.5 text-sm font-medium text-ink">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 rounded-full bg-danger py-2.5 text-sm font-medium text-white hover:opacity-90">
            Delete tour
          </button>
        </div>
      </div>
    </div>
  );
}
