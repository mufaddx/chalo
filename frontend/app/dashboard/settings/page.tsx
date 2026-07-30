"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, Check, Lock, LogOut, X } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Account settings</h1>
      </div>

      <section className="max-w-xl rounded-[var(--radius-lg)] border border-line bg-white p-6">
        <h2 className="flex items-center gap-2 font-display text-[15px] font-semibold text-ink">
          <Lock size={16} className="text-teal" /> Change password
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
          }}
          className="mt-4 flex flex-col gap-3"
        >
          <input type="password" required placeholder="Current password" className="rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink" />
          <input type="password" required minLength={8} placeholder="New password" className="rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink" />
          <input type="password" required minLength={8} placeholder="Confirm new password" className="rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink" />
          <div className="mt-1 flex items-center gap-3">
            <button type="submit" className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-teal">
              Update password
            </button>
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-teal">
                <Check size={15} /> Updated
              </span>
            )}
          </div>
        </form>
      </section>

      <section className="max-w-xl rounded-[var(--radius-lg)] border border-line bg-white p-6">
        <h2 className="font-display text-[15px] font-semibold text-ink">Session</h2>
        <p className="mt-1 text-sm text-slate">Signed in on this device.</p>
        <Link href="/" className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2.5 text-sm font-medium text-ink hover:border-ink">
          <LogOut size={15} /> Log out
        </Link>
      </section>

      <section className="max-w-xl rounded-[var(--radius-lg)] border border-danger/30 bg-white p-6">
        <h2 className="flex items-center gap-2 font-display text-[15px] font-semibold text-danger">
          <AlertTriangle size={16} /> Delete account
        </h2>
        <p className="mt-2 text-sm text-slate">
          This permanently deletes your profile, saved travellers, and booking history. Bookings already
          in progress with an agency are not automatically cancelled — contact support first if you have one.
        </p>
        <button
          onClick={() => setConfirmDelete(true)}
          className="mt-4 rounded-full border border-danger px-4 py-2.5 text-sm font-medium text-danger hover:bg-danger/5"
        >
          Delete my account
        </button>
      </section>

      {confirmDelete && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setConfirmDelete(false)} />
          <div className="relative w-full max-w-sm rounded-[var(--radius-lg)] bg-white p-6">
            <button onClick={() => setConfirmDelete(false)} className="absolute right-4 top-4 text-slate hover:text-ink" aria-label="Close">
              <X size={20} />
            </button>
            <h3 className="font-display text-lg font-semibold text-ink">Are you sure?</h3>
            <p className="mt-2 text-sm text-slate">This can't be undone. Type <strong>DELETE</strong> to confirm.</p>
            <input placeholder="DELETE" className="mt-4 w-full rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-danger" />
            <div className="mt-4 flex gap-2">
              <button onClick={() => setConfirmDelete(false)} className="flex-1 rounded-full border border-line py-2.5 text-sm font-medium text-ink">
                Cancel
              </button>
              <button className="flex-1 rounded-full bg-danger py-2.5 text-sm font-medium text-white hover:opacity-90">
                Delete account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
