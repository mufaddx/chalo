"use client";

import { useState } from "react";
import { PanelLeft, X } from "lucide-react";
import AdminSidebar from "./sidebar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-paper-soft">
      <div className="hidden h-full w-[260px] shrink-0 border-r border-line bg-white lg:block">
        <AdminSidebar />
      </div>

      <div className="flex h-full min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-line bg-white px-4 py-3 lg:hidden">
          <h1 className="font-display text-lg font-semibold text-ink">Voyagr Admin</h1>
          <button
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink"
            aria-label="Open admin menu"
          >
            <PanelLeft size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-8">{children}</div>
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
