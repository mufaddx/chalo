"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, Check } from "lucide-react";
import { currentCustomer } from "@/lib/dashboard-data";

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Profile</h1>
      <p className="mt-1 text-sm text-slate">Keep this up to date — it's used to prefill every booking.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSaved(true);
          setTimeout(() => setSaved(false), 2500);
        }}
        className="mt-6 max-w-xl rounded-[var(--radius-lg)] border border-line bg-white p-6"
      >
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-full border border-line">
            <Image src={currentCustomer.avatar} alt={currentCustomer.name} fill className="object-cover" />
          </div>
          <button type="button" className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-xs font-medium text-ink hover:border-ink">
            <Camera size={13} /> Change photo
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Full name" name="name" defaultValue={currentCustomer.name} />
          <Field label="Email" name="email" type="email" defaultValue={currentCustomer.email} />
          <Field label="Phone" name="phone" defaultValue={currentCustomer.phone} />
          <Field label="Date of birth" name="dob" type="date" defaultValue={currentCustomer.dateOfBirth} />
          <label className="flex flex-col gap-1.5 text-[13px] font-medium text-slate">
            Gender
            <select name="gender" defaultValue={currentCustomer.gender} className="rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-ink">
              <option>Female</option>
              <option>Male</option>
              <option>Other</option>
            </select>
          </label>
        </div>

        <label className="mt-4 flex flex-col gap-1.5 text-[13px] font-medium text-slate">
          Address
          <textarea name="address" defaultValue={currentCustomer.address} rows={2} className="resize-none rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-ink" />
        </label>

        <h2 className="mt-6 font-display text-[15px] font-semibold text-ink">Emergency contact</h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Contact name" name="emergencyName" defaultValue={currentCustomer.emergencyContactName} />
          <Field label="Contact phone" name="emergencyPhone" defaultValue={currentCustomer.emergencyContactPhone} />
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
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-[13px] font-medium text-slate">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        className="rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-ink"
      />
    </label>
  );
}
