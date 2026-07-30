"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, Check } from "lucide-react";
import { currentAgency } from "@/lib/agency-dashboard-data";

export default function AgencyProfilePage() {
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Agency profile</h1>
      <p className="mt-1 text-sm text-slate">This is what customers see on your public agency page.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSaved(true);
          setTimeout(() => setSaved(false), 2500);
        }}
        className="mt-6 max-w-2xl rounded-[var(--radius-lg)] border border-line bg-white p-6"
      >
        <div className="relative h-36 w-full overflow-hidden rounded-xl bg-paper-dim">
          <Image src={currentAgency.cover} alt="" fill className="object-cover" />
          <button type="button" className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full glass-dark px-3 py-1.5 text-xs font-medium text-white">
            <Camera size={12} /> Change banner
          </button>
        </div>

        <div className="relative -mt-10 ml-4 flex items-end gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-white">
            <Image src={currentAgency.logo} alt={currentAgency.name} fill className="object-cover" />
          </div>
          <button type="button" className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink hover:border-ink">
            <Camera size={12} /> Change logo
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Agency name" name="name" defaultValue={currentAgency.name} />
          <Field label="Years of experience" name="years" type="number" defaultValue={String(currentAgency.yearsExperience)} />
          <Field label="Phone" name="phone" defaultValue={currentAgency.phone} />
          <Field label="Email" name="email" type="email" defaultValue={currentAgency.email} />
          <Field label="Website" name="website" defaultValue={currentAgency.website} />
          <Field label="City" name="city" defaultValue={currentAgency.city} />
        </div>

        <label className="mt-4 flex flex-col gap-1.5 text-[13px] font-medium text-slate">
          Office address
          <textarea name="address" defaultValue={currentAgency.city} rows={2} className="resize-none rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-ink" />
        </label>

        <label className="mt-4 flex flex-col gap-1.5 text-[13px] font-medium text-slate">
          About your agency
          <textarea name="about" defaultValue={currentAgency.about} rows={4} className="resize-none rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-ink" />
        </label>

        <h2 className="mt-6 font-display text-[15px] font-semibold text-ink">Social media</h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Instagram" name="instagram" placeholder="instagram.com/youragency" />
          <Field label="Facebook" name="facebook" placeholder="facebook.com/youragency" />
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button type="submit" className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-teal">
            Save changes
          </button>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-teal">
              <Check size={15} /> Saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-[13px] font-medium text-slate">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-ink"
      />
    </label>
  );
}
