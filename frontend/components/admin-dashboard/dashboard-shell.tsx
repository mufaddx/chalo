"use client";

import { useState } from "react";
import { PanelLeft, X } from "lucide-react";
import AdminSidebar from "./sidebar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="container-page py-6 sm:py-8">
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <h1 className="font-display text-lg font-semibold text-ink">Voyagr Admin</h1>
        <button
          onClick={() => setOpen(true)}
          className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink"
          aria-label="Open admin menu"
        >
          <PanelLeft size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[250px_1fr]">
        <div className="hidden rounded-[var(--radius-lg)] border border-line bg-white lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-120px)]">
            <AdminSidebar />
          </div>
        </div>

        <div className="min-w-0">{children}</div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[82%] max-w-xs bg-white">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full text-slate"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
            <AdminSidebar />
          </div>
        </div>
      )}
    </div>
  );
}
